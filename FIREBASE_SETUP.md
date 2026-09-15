# Firebase Service Account & Production Setup Guide

This guide outlines how to connect the Noor Admin Panel and Backend to your live Google Cloud Firebase project (Firestore + Firebase Storage).

---

## 1. Prerequisites
1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Cloud Firestore** in Production mode.
3. Enable **Firebase Cloud Storage**.

---

## 2. Generate Service Account Key
1. In the Firebase Console, go to **Project Settings** (gear icon) > **Service Accounts**.
2. Click **Generate New Private Key**, then click **Generate Key**.
3. Download the `.json` file and save it in the root directory of this project as:
   ```
   serviceAccountKey.json
   ```
   *(Note: `serviceAccountKey.json` is already excluded in `.gitignore` so your secrets are never committed).*

---

## 3. Configure Environment Variables
Alternatively, you can provide the credentials via environment variables in `.env`:

```env
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-firebase-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-firebase-project-id.appspot.com
JWT_SECRET=your_super_strong_jwt_secret_min_32_chars
```

---

## 4. Deploy Firestore Security Rules
Deploy `firestore.rules` using the Firebase CLI:
```bash
firebase deploy --only firestore:rules
```
Or use the provided `firestore.rules` directly in the Firebase Console Rules editor tab.

---

## 5. Initialize Root Admin via Seed CLI
Run the standalone CLI script to insert or update the root admin document:
```bash
node seed-admin.js
```
Follow the interactive prompts to enter the admin email and plaintext password. The script hashes the password with `bcryptjs` and commits the record to `admins/root_admin`.
