// Builds the admin panel (hok_admin) and copies it into the main app's dist/hok_admin
// so that a single Vercel deployment serves both the storefront and /hok_admin/.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const adminDir = path.join(root, "hok_admin");
const target = path.join(root, "dist", "hok_admin");

const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: "inherit" });

run("npm install --no-audit --no-fund", adminDir);
run("npm run build", adminDir);

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(path.join(adminDir, "dist"), target, { recursive: true });
console.log(`Admin build copied to ${target}`);
