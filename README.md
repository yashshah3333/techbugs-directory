# TechBugs GitHub Pages Build

This folder is ready to upload to GitHub Pages.

## Files

- `index.html` - the app

## What this app does

- lets you sign in with Google
- lets you create your own email/password login
- syncs saved endpoints across devices using Firebase Firestore
- already includes your Firebase project details, so users do not need to enter them on each device

## Before publishing

You already have the Firebase project details added inside this build.

### In Firebase

1. Go to Firebase Console.
2. Open your project.
3. Open `Build > Authentication > Sign-in method`.
4. Turn on `Google`.
5. Turn on `Email/Password`.
6. Open `Build > Firestore Database`.
7. Make sure Firestore is created.

## Upload to GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this folder.
3. In the repository, open `Settings > Pages`.
4. Under `Build and deployment`, set:
   - `Source` = `Deploy from a branch`
   - `Branch` = `main`
   - `Folder` = `/ (root)`
5. Save.
6. Wait for GitHub Pages to publish your site.
7. Open the published site URL.

## Important Firebase step after publishing

After GitHub Pages gives you your website URL:

1. Go back to Firebase Console.
2. Open `Authentication > Settings > Authorized domains`.
3. Add your GitHub Pages domain.
   Example: `yourname.github.io`
4. If your app is inside a project repo, your page may look like:
   `https://yourname.github.io/repository-name/`

## First launch

1. Open your GitHub Pages website.
2. Sign in with Google or create an email/password account.
3. Start saving endpoints.

## Suggested Firestore rules

Use rules like this in Firestore so each signed-in user only sees their own data:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /directories/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
