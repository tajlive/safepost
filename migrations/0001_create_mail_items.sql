CREATE TABLE IF NOT EXISTS mail_items (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  received_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  scan_url TEXT,
  scanned_at TEXT,
  description TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
