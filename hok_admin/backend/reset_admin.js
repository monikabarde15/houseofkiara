import pkg from 'pg';
const { Client } = pkg;
import crypto from "crypto";
import { promisify } from "util";
import dotenv from "dotenv";

dotenv.config();

const scrypt = promisify(crypto.scrypt);
const hashPassword = async (password, salt = crypto.randomBytes(16).toString("hex")) => ({
  salt,
  hash: (await scrypt(password, salt, 64)).toString("hex"),
});

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    await client.connect();
    
    const credentials = await hashPassword("password123");
    const email = "admin@houseofkaira.com";
    
    // First, let's delete any broken rows
    await client.query('DELETE FROM admins WHERE email = $1', [email]);
    
    // Now create it properly with both columns AND the `data` JSONB populated
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const id = crypto.randomUUID();
    
    const dataObj = {
      _id: id,
      name: "Admin",
      email: email,
      passwordHash: credentials.hash,
      passwordSalt: credentials.salt,
      sessionToken: sessionToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await client.query(
      'INSERT INTO admins (_id, name, email, password_hash, password_salt, session_token, data, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [id, "Admin", email, credentials.hash, credentials.salt, sessionToken, JSON.stringify(dataObj), new Date(), new Date()]
    );
    
    console.log("Admin created perfectly with password 'password123'");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await client.end();
    process.exit(0);
  }
}
run();
