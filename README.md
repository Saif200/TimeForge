# TimeForge

A personal time-management app built for juggling multiple tracks at once —
trading, coding, content creation, language learning, WordPress/SEO, and
anything else you're working on. It gives you:

- **Today's schedule** — fixed time blocks ("9:00–10:30 C programming")
- **Task queue** — flexible to-dos with no fixed time, pulled in when you're free
- **Focus timer** — start/pause/stop, logs exactly how long you spent and on what
- **Live ticker bar** — today's time-per-track, updating live as you work
- **Daily/weekly summary** — where your hours actually went
- **Cross-device sync** — sign in with Google, same data on your Chromebook and phone
- **Installable** — add it to your Android home screen like a real app

It's a static site (no server to run or pay for) that you deploy for free on
GitHub Pages.

---

## 1. Run it locally first (optional but recommended)

You'll need [Node.js](https://nodejs.org) installed (v18+).

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). The app works
immediately with **local-only storage** — nothing else needed yet. Sync
across devices is the next step.

---

## 2. Set up free cross-device sync (Firebase)

This step is what lets the same data show up on your Chromebook *and* your
phone. It's free for personal use (Firebase's free "Spark" plan), no credit
card required.

1. Go to **[console.firebase.google.com](https://console.firebase.google.com)**
   and sign in with any Google account.
2. Click **Add project** → name it anything (e.g. `timeforge`) → finish the
   wizard (you can disable Google Analytics, you don't need it).
3. In your new project, click the **web icon (`</>`)** to add a web app →
   name it `timeforge` → **Register app**. Firebase shows you a code block
   that looks like this:

   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "timeforge-xxxxx.firebaseapp.com",
     projectId: "timeforge-xxxxx",
     storageBucket: "timeforge-xxxxx.appspot.com",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

4. Open `src/firebase.js` in this project and paste your real values into
   the `firebaseConfig` object near the top (replacing the `YOUR_...`
   placeholders).

5. Back in the Firebase console, turn on sign-in:
   **Build → Authentication → Get started → Sign-in method → Google → Enable → Save.**

6. Turn on the database:
   **Build → Firestore Database → Create database → Start in production
   mode → choose any location → Enable.**

7. Still in Firestore, click the **Rules** tab and replace the contents with:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

   Click **Publish**. This makes sure only you can read or write your own
   data.

8. Run `npm run dev` again and reload — you should now see a **"Sign in with
   Google"** screen. Sign in, and you're syncing.

If you skip this whole section, the app still works fine — it just stores
data only on the device you're using (check the badge in the top-right: it
will say **"Local only"** instead of **"Synced"**).

---

## 3. Deploy to GitHub Pages

### One-time setup

1. Create a new repository on GitHub (e.g. `timeforge`) — don't initialize
   it with a README, you already have one.
2. In `vite.config.js`, make sure `base` matches your repo name exactly:

   ```js
   base: '/timeforge/',   // change "timeforge" to your repo's name
   ```

3. Push this project to your new repo:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/timeforge.git
   git push -u origin main
   ```

4. On GitHub, go to your repo → **Settings → Pages** → under **Build and
   deployment**, set **Source** to **GitHub Actions**.

That's it. The included workflow (`.github/workflows/deploy.yml`) will
automatically build and publish the site every time you push to `main`.
Check the **Actions** tab on GitHub to watch it deploy — after a minute or
two, your app will be live at:

```
https://YOUR_USERNAME.github.io/timeforge/
```

### Updating later

Any time you make changes:

```bash
git add .
git commit -m "Describe your change"
git push
```

GitHub Actions handles the rest automatically.

### Also add your live URL to Firebase

Once deployed, go back to Firebase console →
**Authentication → Settings → Authorized domains → Add domain**, and add:

```
YOUR_USERNAME.github.io
```

Without this step, Google sign-in will fail on the live site (it'll still
work on `localhost` during development).

---

## 4. Install it on your Android phone

1. Open your deployed URL in Chrome on Android.
2. Tap the **⋮** menu → **Add to Home screen** (or you may see an automatic
   "Install app" prompt).
3. It now opens like a normal app, full-screen, with its own icon.

On your Chromebook, Chrome will show an install icon (⊕) in the address bar
— click it to install the same way.

---

## How the tracks work

Six built-in categories cover everything you mentioned (trading, coding,
content, language, WordPress/SEO, other). To rename, add, or remove tracks,
edit the `TRACKS` array near the top of `src/useAppData.js`:

```js
export const TRACKS = [
  { id: 'trading', label: 'Trading', color: '#3DDC97' },
  // add/edit/remove entries here — id must stay unique and lowercase
]
```

## How time tracking works

- **Schedule blocks** are for things with a fixed time ("9–10:30am").
  Checking one off doesn't log time automatically — it's a planning tool.
- **Focus timer** is what actually logs tracked time. Pick a track, hit
  Start, work, then **Stop & log** when done. That session is what shows up
  in the ticker bar and the summary.
- You can jump from a task in the queue straight into a focus session by
  tapping **Focus** on that task — it pre-fills the timer.
- The **Summary** panel totals your logged sessions by track, for today or
  this week, plus a recent-sessions list so you can see exactly where time
  went.

## Project structure

```
src/
  App.jsx          – top-level layout, auth gate, mobile tab switching
  firebase.js       – all Firebase config and sync logic (only file to edit for setup)
  useAppData.js     – data model, localStorage + cloud persistence, track definitions
  TickerBar.jsx      – live per-track time strip at the top
  Schedule.jsx       – fixed time-block planner
  TaskQueue.jsx      – flexible to-do list
  FocusTimer.jsx     – start/pause/stop timer that logs sessions
  Summary.jsx        – daily/weekly breakdown + recent sessions
  timeUtils.js       – date/time formatting helpers
  Icons.jsx          – small inline SVG icon set
```

No backend code to maintain — it's a static site, Firebase handles the
database and auth for you on its free tier.
