# Web Application Testing Demo

This project demonstrates three types of testing:
1. **Unit Test**: Implemented in Rust (server side). Run with `cargo test` in `server/` directory.
2. **System Test**: API testing using Python `unittest`. Run with `python tests/system/system_test.py`.
3. **E2E Test**: Browser testing using Playwright. Run with `npm test` in `tests/e2e/` directory.

## How to Run
1. Start the server: `cd server && cargo run`
2. Start the client: `cd client && npm start`
3. Run tests...
