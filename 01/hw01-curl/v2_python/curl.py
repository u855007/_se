import socket
import ssl
import sys

def main():
    if len(sys.argv) != 3:
        print("Usage: python curl.py <resource> <id>")
        sys.exit(1)

    resource = sys.argv[1]
    resource_id = sys.argv[2]
    host = "jsonplaceholder.typicode.com"
    port = 443
    path = f"/{resource}/{resource_id}"

    # Create TCP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Wrap with SSL/TLS
    context = ssl.create_default_context()
    ssock = context.wrap_socket(sock, server_hostname=host)

    try:
        ssock.connect((host, port))

        # Construct HTTP request
        request = (
            f"GET {path} HTTP/1.1\r\n"
            f"Host: {host}\r\n"
            f"Connection: close\r\n"
            f"\r\n"
        )
        ssock.sendall(request.encode('utf-8'))

        # Receive response
        response = b""
        while True:
            data = ssock.recv(4096)
            if not data:
                break
            response += data

    except Exception as e:
        # print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        ssock.close()

    # Split headers and body
    try:
        header_part, body_part = response.split(b"\r\n\r\n", 1)
    except ValueError:
        sys.exit(1)

    headers_text = header_part.decode('utf-8', errors='ignore')
    status_line = headers_text.splitlines()[0]

    # Check for 200 OK
    if "200 OK" not in status_line:
        sys.exit(1)

    # Handle Chunked Transfer Encoding
    if "Transfer-Encoding: chunked" in headers_text:
        decoded_body = b""
        offset = 0
        while offset < len(body_part):
            # Find the end of the chunk size line
            line_end = body_part.find(b"\r\n", offset)
            if line_end == -1:
                break

            chunk_size_str = body_part[offset:line_end].decode('utf-8', errors='ignore')
            try:
                chunk_size = int(chunk_size_str, 16)
            except ValueError:
                break

            if chunk_size == 0:
                break

            # Move to start of chunk data
            offset = line_end + 2
            # Extract chunk data
            decoded_body += body_part[offset : offset + chunk_size]
            # Skip the \r\n at the end of the chunk
            offset += chunk_size + 2

        sys.stdout.buffer.write(decoded_body)
    else:
        sys.stdout.buffer.write(body_part)

if __name__ == "__main__":
    main()
