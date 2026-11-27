import io
import json
import unittest
from contextlib import redirect_stderr
from unittest.mock import patch

import lab


class LabTests(unittest.TestCase):
    def run_example(self, mode, max_steps=5):
        requests = []
        demo = lab.demo_model(mode)

        def record(payload):
            requests.append(payload)
            return demo(payload)

        with redirect_stderr(io.StringIO()):
            answer = lab.run_lesson(mode, record, lab.QUESTIONS[mode], max_steps)
        return answer, requests

    def test_ask_through_http_adapter(self):
        response = lab.demo_model("ask")({})
        with (
            patch.dict("os.environ", {"OPENAI_API_KEY": "test-key", "OPENAI_MODEL": "test-model"}),
            patch("lab.urlopen", return_value=io.BytesIO(json.dumps(response).encode())) as send,
            redirect_stderr(io.StringIO()),
        ):
            answer = lab.run_lesson("ask", lab.send_openai, lab.QUESTIONS["ask"], 5)
        request = send.call_args.args[0]
        payload = json.loads(request.data)
        self.assertIn("介面", answer)
        self.assertEqual(request.get_method(), "POST")
        self.assertEqual(request.full_url, "https://api.openai.com/v1/responses")
        self.assertEqual(request.get_header("Authorization"), "Bearer test-key")
        self.assertEqual(payload["model"], "test-model")
        self.assertFalse(payload["store"])
        self.assertEqual(payload["input"], [lab.user_message(lab.QUESTIONS["ask"])])
        self.assertNotIn("tools", payload)

    def test_chat_replays_history(self):
        answer, requests = self.run_example("chat")
        self.assertEqual(answer, "晨讀")
        self.assertEqual(len(requests), 2)
        history = requests[1]["input"]
        self.assertEqual([item["role"] for item in history], ["user", "assistant", "user"])
        self.assertIn("晨讀", history[0]["content"])
        self.assertNotIn("晨讀", history[2]["content"])

    def test_tool_returns_output_with_original_call_id(self):
        _, requests = self.run_example("tool")
        self.assertEqual([request["tool_choice"] for request in requests], ["required", "none"])
        self.assertEqual([tool["name"] for tool in requests[0]["tools"]], ["get_assignment"])
        call, result = requests[1]["input"][-2:]
        self.assertEqual(result["type"], "function_call_output")
        self.assertEqual(result["call_id"], call["call_id"])
        self.assertIn("可執行範例", json.loads(result["output"])["requirements"])

    def test_agent_accumulates_observations_and_stops_on_answer(self):
        answer, requests = self.run_example("agent")
        self.assertEqual(len(requests), 3)
        self.assertTrue(all(request["tool_choice"] == "auto" for request in requests))
        call_list, result_list, call_detail, result_detail = requests[-1]["input"][1:]
        self.assertEqual(call_list["name"], "list_assignments")
        self.assertEqual(call_detail["name"], "get_assignment")
        rows = json.loads(result_list["output"])["assignments"]
        earliest = min((row for row in rows if not row["done"]), key=lambda row: row["due"])
        self.assertNotIn("requirements", earliest)
        self.assertEqual(json.loads(call_detail["arguments"])["code"], earliest["code"])
        self.assertEqual(result_detail["call_id"], call_detail["call_id"])
        self.assertEqual(json.loads(result_detail["output"])["due"], earliest["due"])
        self.assertIn(earliest["due"], answer)

    def test_agent_does_not_execute_a_call_it_cannot_report_back(self):
        with (
            patch("lab.call_tool", wraps=lab.call_tool) as execute,
            self.assertRaisesRegex(lab.LabError, "已達 2 次"),
        ):
            self.run_example("agent", max_steps=2)
        execute.assert_called_once()
        self.assertEqual(execute.call_args.args[0]["name"], "list_assignments")

    def test_unknown_tools_and_invalid_arguments_return_errors(self):
        cases = [
            ("other", "{}"),
            ("list_assignments", "{}"),
            ("get_assignment", "{"),
            ("get_assignment", "[]"),
            ("get_assignment", '{"code":[]}'),
            ("get_assignment", '{"code":"W12","extra":true}'),
            ("get_assignment", '{"code":"W99"}'),
        ]
        for name, arguments in cases:
            with self.subTest(name=name, arguments=arguments):
                result = lab.call_tool({"name": name, "arguments": arguments}, {"get_assignment"})
                self.assertIn("error", result)

    def test_incomplete_response_stops_without_executing_tools(self):
        def incomplete(_payload):
            return {"status": "incomplete", "incomplete_details": {"reason": "max_output_tokens"}}

        with (
            redirect_stderr(io.StringIO()),
            self.assertRaisesRegex(lab.LabError, "max_output_tokens"),
        ):
            lab.run_lesson("agent", incomplete, lab.QUESTIONS["agent"], 5)


if __name__ == "__main__":
    unittest.main()
