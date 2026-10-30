import requests
import unittest

class SystemTest(unittest.TestCase):
    BASE_URL = "http://127.0.0.1:8080"

    def test_hello_endpoint(self):
        response = requests.get(f"{self.BASE_URL}/hello")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.text, "Hello from Rust Server!")

    def test_echo_endpoint(self):
        payload = {"text": "Hello System Test"}
        response = requests.post(f"{self.BASE_URL}/echo", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), payload)

if __name__ == "__main__":
    unittest.main()
