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
    location VARCHAR(255),
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
  `ALTER TABLE customers ADD COLUMN IF NOT EXISTS location VARCHAR(255);`,
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
    city VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Verified',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS _id VARCHAR(64);`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS lister_id VARCHAR(255);`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS name VARCHAR(255);`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS email VARCHAR(255);`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS phone VARCHAR(100);`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS city VARCHAR(100);`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Verified';`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `ALTER TABLE listers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_listers__id ON listers(_id);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_listers_lister_id ON listers(lister_id);`,
  `CREATE INDEX IF NOT EXISTS idx_listers_email ON listers(email);`,
  `CREATE INDEX IF NOT EXISTS idx_listers_phone ON listers(phone);`,
  `CREATE INDEX IF NOT EXISTS idx_listers_status ON listers(status);`,
  `CREATE INDEX IF NOT EXISTS idx_listers_city ON listers(city);`,
  `CREATE INDEX IF NOT EXISTS idx_listers_data_gin ON listers USING GIN (data);`,

  // 5. Offers Table
  `CREATE TABLE IF NOT EXISTS offers (
    _id VARCHAR(64) PRIMARY KEY,
    offer_id VARCHAR(255) UNIQUE NOT NULL,
    enquiry_id VARCHAR(255),
    product_id VARCHAR(255),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Pending',
    is_deleted BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS _id VARCHAR(64);`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS offer_id VARCHAR(255);`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS enquiry_id VARCHAR(255);`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS product_id VARCHAR(255);`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(100);`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending';`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `ALTER TABLE offers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_offers__id ON offers(_id);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_offers_offer_id ON offers(offer_id);`,
  `CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);`,
  `CREATE INDEX IF NOT EXISTS idx_offers_is_deleted ON offers(is_deleted);`,
  `CREATE INDEX IF NOT EXISTS idx_offers_product_id ON offers(product_id);`,
  `CREATE INDEX IF NOT EXISTS idx_offers_customer_email ON offers(customer_email);`,
  `CREATE INDEX IF NOT EXISTS idx_offers_data_gin ON offers USING GIN (data);`,

  // 6. Orders Table
  `CREATE TABLE IF NOT EXISTS orders (
    _id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(255) UNIQUE NOT NULL,
    customer_id VARCHAR(255),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    mode VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Confirmed',
    deposit_status VARCHAR(50) DEFAULT 'Pending',
    payout_status VARCHAR(50) DEFAULT 'Pending Approval',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS _id VARCHAR(64);`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_id VARCHAR(255);`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255);`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS mode VARCHAR(100);`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Confirmed';`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS deposit_status VARCHAR(50) DEFAULT 'Pending';`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS payout_status VARCHAR(50) DEFAULT 'Pending Approval';`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_orders__id ON orders(_id);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);`,
  `CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);`,
  `CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);`,
  `CREATE INDEX IF NOT EXISTS idx_orders_deposit_status ON orders(deposit_status);`,
  `CREATE INDEX IF NOT EXISTS idx_orders_payout_status ON orders(payout_status);`,
  `CREATE INDEX IF NOT EXISTS idx_orders_data_gin ON orders USING GIN (data);`,

  // 7. Payouts Table
  `CREATE TABLE IF NOT EXISTS payouts (
    _id VARCHAR(64) PRIMARY KEY,
    payout_id VARCHAR(255) UNIQUE NOT NULL,
    order_id VARCHAR(255) NOT NULL,
    lister_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255),
    product_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pending',
    due_date TIMESTAMPTZ NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS _id VARCHAR(64);`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS payout_id VARCHAR(255);`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS order_id VARCHAR(255);`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS lister_id VARCHAR(255);`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS product_id VARCHAR(255);`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS product_name VARCHAR(255);`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending';`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ;`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `ALTER TABLE payouts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_payouts__id ON payouts(_id);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_payouts_payout_id ON payouts(payout_id);`,
  `CREATE INDEX IF NOT EXISTS idx_payouts_lister_status ON payouts(lister_id, status);`,
  `CREATE INDEX IF NOT EXISTS idx_payouts_order_id ON payouts(order_id);`,
  `CREATE INDEX IF NOT EXISTS idx_payouts_product_id ON payouts(product_id);`,
  `CREATE INDEX IF NOT EXISTS idx_payouts_due_date ON payouts(due_date);`,
  `CREATE INDEX IF NOT EXISTS idx_payouts_data_gin ON payouts USING GIN (data);`,

  // 8. Products Table
  `CREATE TABLE IF NOT EXISTS products (
    _id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    designer VARCHAR(255),
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Draft',
    availability VARCHAR(100) DEFAULT 'Available Now',
    lister_id VARCHAR(255),
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS _id VARCHAR(64);`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS product_id VARCHAR(255);`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS name VARCHAR(255);`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS designer VARCHAR(255);`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100);`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Draft';`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS availability VARCHAR(100) DEFAULT 'Available Now';`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS lister_id VARCHAR(255);`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_products__id ON products(_id);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_products_product_id ON products(product_id);`,
  `CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);`,
  `CREATE INDEX IF NOT EXISTS idx_products_designer ON products(designer);`,
  `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);`,
  `CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);`,
  `CREATE INDEX IF NOT EXISTS idx_products_availability ON products(availability);`,
  `CREATE INDEX IF NOT EXISTS idx_products_lister_id ON products(lister_id);`,
  `CREATE INDEX IF NOT EXISTS idx_products_data_gin ON products USING GIN (data);`
];

export const migrate = async () => {
  console.log("Starting PostgreSQL schema migration for 8 tables...");
  const client = await pool.connect();
  try {
    const fullSql = `
      BEGIN;
      ${migrationQueries.join("\n")}
      COMMIT;
    `;
    await client.query(fullSql);
    console.log("PostgreSQL schema migration completed successfully for all 8 tables.");
  } catch (error) {
    try {
      await client.query("ROLLBACK;");
    } catch (_) {}
    console.error("Migration failed:", error);
    throw error;
  } finally {
    client.release();
  }
};

// If run directly via CLI (e.g. node backend/db/migrate.js)
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  migrate()
    .then(() => {
      console.log("Migration script executed cleanly.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration script error:", err);
      process.exit(1);
    });
}
