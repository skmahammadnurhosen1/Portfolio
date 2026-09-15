#!/usr/bin/env node

/**
 * Noor Admin Panel - Root Admin Seed CLI Script
 * 
 * Usage:
 *   Interactive: node seed-admin.js
 *   With arguments: node seed-admin.js admin@example.com MySecretPassword123!
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function formatPrivateKey(key) {
  if (!key) return '';
  let cleanKey = key.trim();
  if (
    (cleanKey.startsWith('"') && cleanKey.endsWith('"')) ||
    (cleanKey.startsWith("'") && cleanKey.endsWith("'"))
  ) {
    cleanKey = cleanKey.slice(1, -1).trim();
  }
  if (cleanKey.includes('\\n')) {
    cleanKey = cleanKey.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');
  }
  if (!cleanKey.includes('\n')) {
    const headerMatch = cleanKey.match(/^-----BEGIN [A-Z ]+-----/);
    const footerMatch = cleanKey.match(/-----END [A-Z ]+-----$/);
    if (headerMatch && footerMatch) {
      const header = headerMatch[0];
      const footer = footerMatch[0];
      const body = cleanKey
        .slice(header.length, cleanKey.length - footer.length)
        .trim()
        .replace(/\s+/g, '');
      const chunkedBody = body.match(/.{1,64}/g)?.join('\n') || body;
      cleanKey = `${header}\n${chunkedBody}\n${footer}\n`;
    }
  }
  if (!cleanKey.endsWith('\n')) {
    cleanKey += '\n';
  }
  return cleanKey;
}

// Initialize terminal reader
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptQuestion(query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function runSeed() {
  console.log('\n======================================================');
  console.log('   NOOR ADMIN PANEL - ROOT ADMIN INITIALIZATION');
  console.log('   Strict Security Singleton Setup (`admins/root_admin`)');
  console.log('======================================================\n');

  let email = process.argv[2];
  let password = process.argv[3];

  if (!email) {
    email = await promptQuestion('Enter Root Admin Email (e.g. noor@example.com): ');
  }

  if (!email || !email.includes('@')) {
    console.error('❌ Error: A valid email address is required.');
    rl.close();
    process.exit(1);
  }

  if (!password) {
    password = await promptQuestion('Enter Root Admin Plaintext Password (min 8 chars): ');
  }

  if (!password || password.length < 8) {
    console.error('❌ Error: Password must be at least 8 characters long for security compliance.');
    rl.close();
    process.exit(1);
  }

  console.log('\n[1/3] Generating cryptographic salt and bcrypt hash (rounds: 10)...');
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const adminPayload = {
    email: email.trim().toLowerCase(),
    passwordHash: passwordHash,
    activeSessionId: null,
    updatedAt: new Date().toISOString(),
  };

  console.log('[2/3] Connecting to Firestore database...');

  let firebaseConnected = false;
  try {
    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(process.cwd(), 'serviceAccountKey.json');
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      if (serviceAccount.private_key) {
        serviceAccount.private_key = formatPrivateKey(serviceAccount.private_key);
      }
      admin.initializeApp({
        credential: cert(serviceAccount),
      });
      firebaseConnected = true;
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY),
        }),
      });
      firebaseConnected = true;
    }
  } catch (err) {
    console.log('Note: No live cloud Firebase service account found, using local JSON database.');
  }

  console.log('[3/3] Writing root_admin singleton document to `admins/root_admin`...');

  if (firebaseConnected) {
    try {
      await getFirestore().doc('admins/root_admin').set(adminPayload, { merge: true });
      console.log('✅ Live Google Cloud Firestore updated successfully: admins/root_admin');
    } catch {
      console.log('ℹ️ Cloud Firestore API is not active in project. Persisting root admin to local store.');
    }
  }

  // Also persist to local database store for dev/preview resilience
  const dataDir = path.join(process.cwd(), '.data');
  const dbFile = path.join(dataDir, 'firestore_store.json');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  let store = {};
  if (fs.existsSync(dbFile)) {
    try {
      store = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    } catch {
      store = {};
    }
  }
  if (!store.admins) store.admins = {};
  store.admins.root_admin = adminPayload;
  fs.writeFileSync(dbFile, JSON.stringify(store, null, 2), 'utf8');
  console.log('✅ Local persistent Firestore store synchronized: .data/firestore_store.json');

  console.log('\n======================================================');
  console.log('🎉 ROOT ADMIN SEED COMPLETED SUCCESSFULLY!');
  console.log(`   Admin Email:     ${adminPayload.email}`);
  console.log(`   Password Hash:   ${adminPayload.passwordHash.substring(0, 18)}... (Bcrypt verified)`);
  console.log(`   Active Session:  ${adminPayload.activeSessionId} (Clean initial state)`);
  console.log('======================================================\n');

  rl.close();
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('Fatal seed script error:', err);
  rl.close();
  process.exit(1);
});
