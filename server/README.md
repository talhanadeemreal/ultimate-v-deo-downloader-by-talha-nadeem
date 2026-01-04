# Server Setup

To enable video downloading, you must run the local server.

1.  Open a terminal in the `server` directory.
2.  Install dependencies:
    ```bash
    npm install
    # or if you use bun
    bun install
    ```
3.  Start the server:
    ```bash
    npm start
    # or
    node index.js
    ```

The server runs on http://localhost:3000.
It will automatically download the `yt-dlp` binary on the first run.
