-- schema.sql — run once against your D1 database:
-- npx wrangler d1 execute bajaworks-reviews --remote --file=./schema.sql

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id TEXT NOT NULL,
  author TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  approved INTEGER NOT NULL DEFAULT 0,
  approve_token TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews (product_id, approved);
