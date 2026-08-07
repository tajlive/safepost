CREATE TABLE IF NOT EXISTS mail_items (
  id           TEXT PRIMARY KEY,
  customer_id  TEXT NOT NULL,
  received_at  TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending',
  scan_url     TEXT,
  scanned_at   TEXT,
  description  TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mail_items_customer ON mail_items(customer_id);
CREATE INDEX IF NOT EXISTS idx_mail_items_status   ON mail_items(status);
CREATE INDEX IF NOT EXISTS idx_mail_items_received ON mail_items(received_at DESC);
