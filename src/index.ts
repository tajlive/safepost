export interface Env {
  safepost_kv: KVNamespace;
  safepost_db: D1Database;
  ASSETS: Fetcher;
  ENVIRONMENT: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // API-ruter
    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env, url);
    }

    // Statiske filer (public/)
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

async function handleApi(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  if (url.pathname === "/api/health") {
    return Response.json({ status: "ok", env: env.ENVIRONMENT }, { headers });
  }

  return Response.json({ error: "Ikke funnet" }, { status: 404, headers });
}
