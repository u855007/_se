import requests
import unittest

class SystemTest(unittest.TestCase):
    BASE_URL = "http://127.0.0.1:8080/proxy"

    def test_proxy_success(self):
        # Test if the proxy can successfully fetch a real public API
        payload = {
            "url": "https://jsonplaceholder.typicode.com/todos/1",
            "method": "GET"
        }
        response = requests.post(self.BASE_URL, json=payload)
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertEqual(data['status'], 200)
        self.assertIn("userId", data['body'])

    def test_proxy_invalid_url(self):
        # Test if the proxy correctly rejects invalid URLs (like ftp://)
        payload = {
            "url": "ftp://invalid-protocol.com",
            "method": "GET"
        }
        response = requests.post(self.BASE_URL, json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.text, "URL must start with http:// or https://")

if __name__ == "__main__":
    unittest.main()
