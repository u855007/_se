import html from "./public/index.html" with { type: "text" };
import script from "./public/app.js" with { type: "text" };
import css from "./public/style.css" with { type: "text" };
import headerRules from "./public/_headers" with { type: "text" };

const assets = new Map([
  ["/", { body: html, type: "text/html; charset=utf-8" }],
  ["/app.js", { body: script, type: "text/javascript; charset=utf-8" }],
  ["/style.css", { body: css, type: "text/css; charset=utf-8" }],
]);
const securityHeaders = new Headers();
for (const line of headerRules.split(/\r?\n/)) {
  const separator = line.indexOf(":");
  if (separator > 0) {
    securityHeaders.set(line.slice(0, separator).trim(), line.slice(separator + 1).trim());
  }
}

/** Serve the study journal on the local IPv4 loopback interface. */
export function serveStudyNotes(port = 8787): Deno.HttpServer<Deno.NetAddr> {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new RangeError("Port must be an integer from 1 to 65535.");
  }

  return Deno.serve({ hostname: "127.0.0.1", port }, (request) => {
    const headers = new Headers(securityHeaders);
    const url = new URL(request.url);
    const host = request.headers.get("host");
    if (host !== `127.0.0.1:${port}` && host !== `localhost:${port}`) {
      return new Response(null, { status: 400, headers });
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      headers.set("Allow", "GET, HEAD");
      return new Response(null, { status: 405, headers });
    }
    const asset = assets.get(url.pathname);
    if (!asset) return new Response(null, { status: 404, headers });
    headers.set("Content-Type", asset.type);
    return new Response(request.method === "HEAD" ? null : asset.body, { headers });
  });
}

if (import.meta.main) {
  if (Deno.args.length === 1 && Deno.args[0] === "--help") {
    console.log("Usage: deno run --allow-net=127.0.0.1 mod.ts [--port 8787]");
  } else if (Deno.args.length === 0) {
    serveStudyNotes();
  } else if (Deno.args.length === 2 && Deno.args[0] === "--port" && /^\d+$/.test(Deno.args[1])) {
    serveStudyNotes(Number(Deno.args[1]));
  } else {
    console.error("Expected --port followed by an integer from 1 to 65535.");
    Deno.exit(1);
  }
}
