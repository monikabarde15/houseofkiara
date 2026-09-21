import { pool } from "../config/db.js";
import { fileURLToPath } from "url";

export const migrationQueries = [
  // 1. Admins Table
  `CREATE TABLE IF NOT EXISTS admins (
    _id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    session_token TEXT,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `ALTER TABLE admins ADD COLUMN IF NOT EXISTS _id VARCHAR(64);`,
  `ALTER TABLE admins ADD COLUMN IF NOT EXISTS email VARCHAR(255);`,
  `ALTER TABLE admins ADD COLUMN IF NOT EXISTS name VARCHAR(255);`,
  `ALTER TABLE admins ADD COLUMN IF NOT EXISTS password_hash TEXT;`,
  `ALTER TABLE admins ADD COLUMN IF NOT EXISTS password_salt TEXT;`,
  `ALTER TABLE admins ADD COLUMN IF NOT EXISTS session_token TEXT;`,
  `ALTER TABLE admins ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;`,
  `ALTER TABLE admins ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `ALTER TABLE admins ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_admins__id ON admins(_id);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_admins_email ON admins(email);`,
  `CREATE INDEX IF NOT EXISTS idx_admins_session_token ON admins(session_token);`,
  `CREATE INDEX IF NOT EXISTS idx_admins_data_gin ON admins USING GIN (data);`,

  // 2. Customers Table
  `CREATE TABLE IF NOT EXISTS customers (
    _id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(100),
    location TEXT,
    status VARCHAR(50) DEFAULT 'Active',
    source VARCHAR(100) DEFAULT 'Manual - WA',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `ALTER TABLE customers ADD COLUMN IF NOT EXISTS _id VARCHAR(64);`,
  `ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255);`,
  `ALTER TABLE customers ADD COLUMN IF NOT EXISTS name VARCHAR(255);`,
  `ALTER TABLE customers ADD COLUMN IF NOT EXISTS email VARCHAR(255);`,
  `ALTER TABLE customers ADD COLUMN IF NOT EXISTS phone VARCHAR(100);`,
  `ALTER TABLE customers ADD COLUMN IF NOT EXISTS location TEXT;`,
  `ALTER TABLE customers ALTER COLUMN location TYPE TEXT;`,
  `ALTER TABLE customers DROP COLUMN IF EXISTS address;`,
  `ALTER TABLE customers ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active';`,
  `ALTER TABLE customers ADD COLUMN IF NOT EXISTS source VARCHAR(100) DEFAULT 'Manual - WA';`,
  `ALTER TABLE customers ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;`,
  `ALTER TABLE customers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_customers__id ON customers(_id);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_customer_id ON customers(customer_id);`,
  `CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);`,
  `CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);`,
  `CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);`,
  `CREATE INDEX IF NOT EXISTS idx_customers_source ON customers(source);`,
  `CREATE INDEX IF NOT EXISTS idx_customers_data_gin ON customers USING GIN (data);`,

  // 3. Designers Table
  `CREATE TABLE IF NOT EXISTS designers (
    _id VARCHAR(64) PRIMARY KEY,
    designer_id VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) DEFAULT 'Indie Designer',
    status VARCHAR(50) DEFAULT 'Active',
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 99,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `ALTER TABLE designers ADD COLUMN IF NOT EXISTS _id VARCHAR(64);`,
  `ALTER TABLE designers ADD COLUMN IF NOT EXISTS designer_id VARCHAR(255);`,
  `ALTER TABLE designers ADD COLUMN IF NOT EXISTS slug VARCHAR(255);`,
  `ALTER TABLE designers ADD COLUMN IF NOT EXISTS name VARCHAR(255);`,
  `ALTER TABLE designers ADD COLUMN IF NOT EXISTS type VARCHAR(100) DEFAULT 'Indie Designer';`,
  `ALTER TABLE designers ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active';`,
  `ALTER TABLE designers ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;`,
  `ALTER TABLE designers ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 99;`,
  `ALTER TABLE designers ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;`,
  `ALTER TABLE designers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `ALTER TABLE designers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_designers__id ON designers(_id);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_designers_designer_id ON designers(designer_id);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_designers_slug ON designers(slug);`,
  `CREATE INDEX IF NOT EXISTS idx_designers_name ON designers(name);`,
  `CREATE INDEX IF NOT EXISTS idx_designers_status ON designers(status);`,
  `CREATE INDEX IF NOT EXISTS idx_designers_type ON designers(type);`,
  `CREATE INDEX IF NOT EXISTS idx_designers_data_gin ON designers USING GIN (data);`,

  // 4. Listers Table
  `CREATE TABLE IF NOT EXISTS listers (
    _id VARCHAR(64) PRIMARY KEY,
    lister_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(100),
    city VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active',
    tier VARCHAR(50) DEFAULT 'Standard',
    commission_rate NUMERIC(5, 2) DEFAULT 20.00,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS _id VARCHAR(64);`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS lister_id VARCHAR(255);`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS name VARCHAR(255);`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS email VARCHAR(255);`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS phone VARCHAR(100);`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS city VARCHAR(255);`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active';`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS tier VARCHAR(50) DEFAULT 'Standard';`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS commission_rate NUMERIC(5, 2) DEFAULT 20.00;`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_listers__id ON listers(_id);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_listers_lister_id ON listers(lister_id);`,
  `CREATE INDEX IF NOT EXISTS idx_listers_email ON listers(email);`,
  `CREATE INDEX IF NOT EXISTS idx_listers_phone ON listers(phone);`,
  `CREATE INDEX IF NOT EXISTS idx_listers_status ON listers(status);`,
  `CREATE INDEX IF NOT EXISTS idx_listers_data_gin ON listers USING GIN (data);`,

  // 5. Products Table
  `CREATE TABLE IF NOT EXISTS products (
    _id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(255) UNIQUE NOT NULL,
    sku VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    designer VARCHAR(255),
    designer_id VARCHAR(255),
    lister_id VARCHAR(255) NOT NULL DEFAULT 'LST-GENERAL',
    category VARCHAR(100),
    subcategory VARCHAR(100),
    rental_price NUMERIC(12, 2) DEFAULT 0,
    retail_price NUMERIC(12, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Available',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS _id VARCHAR(64);`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS product_id VARCHAR(255);`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(255);`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS name VARCHAR(255);`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS brand VARCHAR(255);`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS designer VARCHAR(255);`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS designer_id VARCHAR(255);`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS lister_id VARCHAR(255) NOT NULL DEFAULT 'LST-GENERAL';`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100);`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100);`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS rental_price NUMERIC(12, 2) DEFAULT 0;`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS retail_price NUMERIC(12, 2) DEFAULT 0;`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Available';`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_products__id ON products(_id);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_products_product_id ON products(product_id);`,
  `CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);`,
  `CREATE INDEX IF NOT EXISTS idx_products_designer_id ON products(designer_id);`,
  `CREATE INDEX IF NOT EXISTS idx_products_lister_id ON products(lister_id);`,
  `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);`,
  `CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);`,
  `CREATE INDEX IF NOT EXISTS idx_products_data_gin ON products USING GIN (data);`,

  // 6. Orders Table
  `CREATE TABLE IF NOT EXISTS orders (
    _id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(255) UNIQUE NOT NULL,
    customer_id VARCHAR(255),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(100),
    total_amount NUMERIC(12, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Confirmed',
    type VARCHAR(50) DEFAULT 'Rental',
    payment_status VARCHAR(50) DEFAULT 'Paid',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS _id VARCHAR(64);`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_id VARCHAR(255);`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255);`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(100);`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12, 2) DEFAULT 0;`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Confirmed';`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'Rental';`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'Paid';`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_orders__id ON orders(_id);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);`,
  `CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);`,
  `CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);`,
  `CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);`,
  `CREATE INDEX IF NOT EXISTS idx_orders_data_gin ON orders USING GIN (data);`,

  // 7. Offers Table
  `CREATE TABLE IF NOT EXISTS offers (
    _id VARCHAR(64) PRIMARY KEY,
    offer_id VARCHAR(255) UNIQUE NOT NULL,
    product_id VARCHAR(255),
    lister_id VARCHAR(255),
    customer_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pending',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS _id VARCHAR(64);`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS offer_id VARCHAR(255);`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS product_id VARCHAR(255);`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS lister_id VARCHAR(255);`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255);`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending';`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_offers__id ON offers(_id);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_offers_offer_id ON offers(offer_id);`,
  `CREATE INDEX IF NOT EXISTS idx_offers_product_id ON offers(product_id);`,
  `CREATE INDEX IF NOT EXISTS idx_offers_lister_id ON offers(lister_id);`,
  `CREATE INDEX IF NOT EXISTS idx_offers_customer_id ON offers(customer_id);`,
  `CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);`,
  `CREATE INDEX IF NOT EXISTS idx_offers_data_gin ON offers USING GIN (data);`,

  // 8. Payouts Table
  `CREATE TABLE IF NOT EXISTS payouts (
    _id VARCHAR(64) PRIMARY KEY,
    payout_id VARCHAR(255) UNIQUE NOT NULL,
    lister_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pending',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS _id VARCHAR(64);`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS payout_id VARCHAR(255);`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS lister_id VARCHAR(255);`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending';`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_payouts__id ON payouts(_id);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_payouts_payout_id ON payouts(payout_id);`,
  `CREATE INDEX IF NOT EXISTS idx_payouts_lister_id ON payouts(lister_id);`,
  `CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);`,
  `CREATE INDEX IF NOT EXISTS idx_payouts_data_gin ON payouts USING GIN (data);`,

  // 9. Tasks Table
  `CREATE TABLE IF NOT EXISTS tasks (
    _id VARCHAR(64) PRIMARY KEY,
    task_id VARCHAR(255) UNIQUE NOT NULL,
    assigned_to VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pending',
    priority VARCHAR(50) DEFAULT 'Medium',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS _id VARCHAR(64);`,
  `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS task_id VARCHAR(255);`,
  `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(255);`,
  `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending';`,
  `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Medium';`,
  `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;`,
  `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_tasks__id ON tasks(_id);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_tasks_task_id ON tasks(task_id);`,
  `CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);`,
  `CREATE INDEX IF NOT EXISTS idx_tasks_data_gin ON tasks USING GIN (data);`,

  // 10. Submissions Table
  `CREATE TABLE IF NOT EXISTS submissions (
    _id VARCHAR(64) PRIMARY KEY,
    submission_id VARCHAR(255) UNIQUE NOT NULL,
    lister_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pending',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `ALTER TABLE submissions ADD COLUMN IF NOT EXISTS _id VARCHAR(64);`,
  `ALTER TABLE submissions ADD COLUMN IF NOT EXISTS submission_id VARCHAR(255);`,
  `ALTER TABLE submissions ADD COLUMN IF NOT EXISTS lister_id VARCHAR(255);`,
  `ALTER TABLE submissions ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending';`,
  `ALTER TABLE submissions ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;`,
  `ALTER TABLE submissions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `ALTER TABLE submissions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_submissions__id ON submissions(_id);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_submissions_submission_id ON submissions(submission_id);`,
  `CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);`,
  `CREATE INDEX IF NOT EXISTS idx_submissions_data_gin ON submissions USING GIN (data);`,
];

export const runMigrations = async () => {
  console.log("Starting PostgreSQL schema migration for 10 tables...");
  const client = await pool.connect();
  try {
    await client.query("BEGIN;");
    for (const sql of migrationQueries) {
      await client.query(sql);
    }
    await client.query("COMMIT;");
    console.log("PostgreSQL schema migration completed successfully for all 10 tables.");
  } catch (error) {
    await client.query("ROLLBACK;");
    console.error("PostgreSQL schema migration failed:", error.message);
    throw error;
  } finally {
    client.release();
  }
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  runMigrations()
    .then(() => {
      console.log("Migration script executed cleanly.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration execution error:", err);
      process.exit(1);
    });
}
