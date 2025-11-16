# Google OAuth Setup Instructions

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

## Step 2: Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application"
4. Configure:

   - **Name**: Beyond Earth App
   - **Authorized JavaScript origins**:
     - `http://localhost:8000`
     - `http://127.0.0.1:8000`
   - **Authorized redirect URIs**:
     - `http://localhost:8000/auth/google/callback`
     - `http://127.0.0.1:8000/auth/google/callback`

5. Click "Create"
6. Copy your **Client ID** and **Client Secret**

## Step 3: Update .env File

Add the following to your `.env` file:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

## Step 4: Clear Config Cache

```bash
php artisan config:clear
php artisan cache:clear
```

## Step 5: Test

1. Start your Laravel server: `php artisan serve`
2. Start Vite: `npm run dev`
3. Visit `http://localhost:8000`
4. Click "Sign in with Google" button

## Features Added

- ✅ Google OAuth login integration
- ✅ Automatic user creation with Google profile
- ✅ Avatar support from Google profile
- ✅ Seamless authentication flow
- ✅ Session management

## Database Changes

New columns added to `users` table:

- `google_id` - Stores Google user ID
- `avatar` - Stores user profile picture URL
- `password` - Made nullable for Google-only accounts
