export interface Env {
  SAFEPOST_DB: D1Database;
  ASSETS: Fetcher;
  ENVIRONMENT: string;
}

interface MailItem {
  id: string;
  customer_id: string;
  received_at: string;
  status: string;
  scan_url: string | null;
  scanned_at: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function err(message: string, status = 400): Response {
  return json({ error: message }, status);
}

function nowISO(): string {
  return new Date().toISOString();
}

function randomId(): string {
  return crypto.randomUUID();
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (!path.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }

    if (method === 'POST' && path === '/api/mail') {
      return createMailItem(request, env);
    }

    if (method === 'GET' && path === '/api/mail') {
      return listMailItems(env);
    }

    const mailMatch = path.match(/^\/api\/mail\/([^/]+)$/);
    if (mailMatch) {
      const id = mailMatch[1];
      if (method === 'GET')    return getMailItem(id, env);
      if (method === 'PATCH')  return updateMailItem(id, request, env);
      if (method === 'DELETE') return deleteMailItem(id, env);
    }

    return err('Ikke funnet', 404);
  },
};

async function createMailItem(request: Request, env: Env): Promise<Response> {
  let body: { customer_id?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return err('Ugyldig JSON');
  }

  if (!body.customer_id) return err('customer_id er påkrevd');

  const now = nowISO();
  const item: MailItem = {
    id: randomId(),
    customer_id: body.customer_id,
    received_at: now,
    status: 'pending',
    scan_url: null,
    scanned_at: null,
    description: body.description ?? null,
    created_at: now,
    updated_at: now,
  };

  await env.SAFEPOST_DB
    .prepare(`
      INSERT INTO mail_items
        (id, customer_id, received_at, status, scan_url, scanned_at, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      item.id, item.customer_id, item.received_at, item.status,
      item.scan_url, item.scanned_at, item.description,
      item.created_at, item.updated_at,
    )
    .run();

  return json({ mail: item }, 201);
}

async function listMailItems(env: Env): Promise<Response> {
  const result = await env.SAFEPOST_DB
    .prepare('SELECT * FROM mail_items ORDER BY received_at DESC')
    .all<MailItem>();
  return json({ mail: result.results, total: result.results.length });
}

async function getMailItem(id: string, env: Env): Promise<Response> {
  const item = await env.SAFEPOST_DB
    .prepare('SELECT * FROM mail_items WHERE id = ?')
    .bind(id).first<MailItem>();
  if (!item) return err('Forsendelse ikke funnet', 404);
  return json({ mail: item });
}

async function updateMailItem(id: string, request: Request, env: Env): Promise<Response> {
  const existing = await env.SAFEPOST_DB
    .prepare('SELECT id FROM mail_items WHERE id = ?')
    .bind(id).first<{ id: string }>();
  if (!existing) return err('Forsendelse ikke funnet', 404);

  let body: Partial<Pick<MailItem, 'status' | 'scan_url' | 'scanned_at' | 'description'>>;
  try {
    body = await request.json();
  } catch {
    return err('Ugyldig JSON');
  }

  const allowed = ['status', 'scan_url', 'scanned_at', 'description'] as const;
  const updates: string[] = [];
  const values: unknown[] = [];

  for (const key of allowed) {
    if (key in body) {
      updates.push(`${key} = ?`);
      values.push(body[key]);
    }
  }

  if (updates.length === 0) return err('Ingen gyldige felter å oppdatere');

  updates.push('updated_at = ?');
  values.push(nowISO());
  values.push(id);

  await env.SAFEPOST_DB
    .prepare(`UPDATE mail_items SET ${updates.join(', ')} WHERE id = ?`)
    .bind(...values).run();

  const updated = await env.SAFEPOST_DB
    .prepare('SELECT * FROM mail_items WHERE id = ?')
    .bind(id).first<MailItem>();

  return json({ mail: updated });
}

async function deleteMailItem(id: string, env: Env): Promise<Response> {
  const existing = await env.SAFEPOST_DB
    .prepare('SELECT id FROM mail_items WHERE id = ?')
    .bind(id).first<{ id: string }>();
  if (!existing) return err('Forsendelse ikke funnet', 404);

  await env.SAFEPOST_DB.prepare('DELETE FROM mail_items WHERE id = ?').bind(id).run();
  return json({ deleted: true, id });
}

