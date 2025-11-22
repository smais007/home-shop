/**
 * Script to generate bcrypt password hash for admin users
 * Run this script to create a password hash that you can insert into the database
 *
 * Usage: npx ts-node src/scripts/generate-admin-password.ts
 */

import bcrypt from "bcryptjs";

async function generatePasswordHash(password: string) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log("\n==============================================");
  console.log("Admin Password Hash Generator");
  console.log("==============================================\n");
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}\n`);
  console.log("Copy this hash and use it in your Supabase admins table:");
  console.log("\nINSERT INTO admins (email, password_hash)");
  console.log(`VALUES ('admin@gmail.com', '${hash}');`);
  console.log("\n==============================================\n");
}

// Generate hash for default password
const defaultPassword = "Samia420@";
generatePasswordHash(defaultPassword);
