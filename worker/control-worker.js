/**
 * TJB Autonomous Worker — Control API (Cloudflare Worker + Durable Object)
 *
 * Provides the dashboard Pause/Resume toggle. The dashboard calls this Worker
 * to read/write the pause flag. The local cron syncs this flag into
 * ~/.hermes/state/tjb-autonomous-control.json at the start of each run.
 *
 * Routes:
 *   GET  /api/control          → { paused, reason, updated_at }
 *   POST /api/control/pause    → set paused=true  (body: { reason? })
 *   POST /api/control/resume   → set paused=false
 *
 * Auth: requires header `x-control-key: <CONTROL_KEY>` on POST (write) routes.
 * GET is public (the dashboard needs to read state without a secret).
 *
 * CORS: restricted to https://truejoybirthing.com (and http://localhost:4321 for dev).
 *
 * Bindings (wrangler.toml):
 *   [[durable_objects]]
 *   name = "TJB_CONTROL"
 *   class_name = "TJBControl"
 *
 *   [[migrations]]
 *   tag = "v1"
 *   new_sqlite_classes = ["TJBControl"]
 *
 * Env vars:
 *   CONTROL_KEY — shared secret for write operations
 */

const ALLOWED_ORIGINS = [
  "https://truejoybirthing.com",
  "http://localhost:4321", // local dev
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "";

    const cors = {
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-control-key",
    };
    if (allowedOrigin) {
      cors["Access-Control-Allow-Origin"] = allowedOrigin;
      cors["Vary"] = "Origin";
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // Route all /api/control* requests to the Durable Object
    if (url.pathname.startsWith("/api/control")) {
      const id = env.TJB_CONTROL.idFromName("default");
      const stub = env.TJB_CONTROL.get(id);
      return stub.fetch(request);
    }

    return new Response(JSON.stringify({ error: "not found" }), {
      status: 404,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  },
};

export class TJBControl {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "";

    const cors = {
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-control-key",
    };
    if (allowedOrigin) {
      cors["Access-Control-Allow-Origin"] = allowedOrigin;
      cors["Vary"] = "Origin";
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // GET — read state (public)
    if (request.method === "GET" && url.pathname === "/api/control") {
      const raw = await this.state.storage.get("state");
      const state = raw || { paused: false, reason: null, updated_at: null };
      return new Response(JSON.stringify(state), {
        status: 200,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // POST — write state (requires control key)
    if (request.method === "POST" && (url.pathname === "/api/control/pause" || url.pathname === "/api/control/resume")) {
      const provided = request.headers.get("x-control-key");
      if (!this.env.CONTROL_KEY || provided !== this.env.CONTROL_KEY) {
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }

      const paused = url.pathname.endsWith("/pause");
      let reason = null;
      if (paused) {
        try {
          const body = await request.json();
          reason = body.reason || null;
        } catch {
          reason = null;
        }
      }

      const state = {
        paused,
        reason: paused ? reason : null,
        updated_at: new Date().toISOString(),
      };
      await this.state.storage.put("state", state);

      return new Response(JSON.stringify({ ok: true, ...state }), {
        status: 200,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "not found" }), {
      status: 404,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
}
