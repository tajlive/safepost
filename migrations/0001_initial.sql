CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  org_nr TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE mail_items (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(id),
  received_at INTEGER NOT NULL DEFAULT (unixepoch()),
  scanned_at INTEGER,
  scan_url TEXT,
  status TEXT NOT NULL DEFAULT 'received',
  sent_at INTEGER,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX idx_mail_customer ON mail_items(customer_id);
CREATE INDEX idx_mail_status ON mail_items(status);
