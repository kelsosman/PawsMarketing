# Paws 🐾 — HomeDog Content Assistant

Meet **Paws** — your mobile-first content assistant for HomeDog's social media, events, and ad campaigns. Built as a static site — no server, no API keys, no monthly costs. Hosted free on GitHub Pages.

## What Paws Does

- **Paste your raw notes** → get polished, on-brand content for Instagram, Facebook, TikTok, Eventbrite, and ad platforms
- **Pre-built templates** for puppy yoga, vendor markets, adoption events, private parties, coworking promos, and more
- **Auto-generated hashtags** tailored per platform
- **Ad copy variants** (A/B testing) for Meta, Google, and TikTok ads
- **Photo upload** with Instagram Story text overlay preview and composite image export
- **Content calendar** to schedule and visualize upcoming posts
- **Performance tracking** to rate posts and see what works best
- **Voice-to-text** input for on-the-go brain dumps
- **Works on iPhone, Android, and desktop browsers** (Safari, Chrome, Edge, Firefox)

---

## Setup Instructions (Step by Step)

### You'll need:
- A GitHub account (free) — sign up at [github.com](https://github.com)
- About 10 minutes

### Step 1: Create a New Repository

1. Go to [github.com/new](https://github.com/new)
2. **Repository name:** `homedog-content-generator`
3. **Description:** `HomeDog social media content generator`
4. Set it to **Public** (required for free GitHub Pages hosting)
5. Check **"Add a README file"** (we'll replace it)
6. Click **Create repository**

### Step 2: Upload the Files

**Option A: Upload via GitHub Web (easiest)**

1. In your new repo, click **"Add file"** → **"Upload files"**
2. Drag and drop ALL the files and folders from this project:
   - `index.html`
   - `css/` folder (with `style.css` inside)
   - `js/` folder (with all `.js` files inside)
   - `README.md` (this file — will replace the one GitHub created)
3. Scroll down, type a commit message like `Initial upload`
4. Click **"Commit changes"**

**Important:** GitHub's file uploader can be finicky with folders. If it flattens everything, you may need to create the folders first:
- Click **"Add file"** → **"Create new file"**
- Type `css/style.css` in the filename field (this creates the folder automatically)
- Paste the contents of `style.css`
- Repeat for each file in the `js/` folder

**Option B: Upload via Git command line (if comfortable)**

```bash
git clone https://github.com/YOUR_USERNAME/homedog-content-generator.git
cd homedog-content-generator

# Copy all project files into this folder, then:
git add .
git commit -m "Initial upload"
git push origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repo's **Settings** tab (gear icon)
2. In the left sidebar, click **Pages**
3. Under **"Source"**, select **"Deploy from a branch"**
4. Under **"Branch"**, select **main** and **/ (root)**
5. Click **Save**
6. Wait 1-2 minutes, then refresh the page
7. You'll see a green box with your live URL:
   `https://YOUR_USERNAME.github.io/homedog-content-generator/`

### Step 4: Use It!

1. Open that URL on your phone or computer
2. **Bookmark it** or add it to your home screen:
   - **iPhone:** Open in Safari → tap Share → "Add to Home Screen"
   - **Android:** Open in Chrome → tap three dots → "Add to Home Screen"
3. It now works like an app — no app store needed!

---

## How to Use

### Quick Start (60-second workflow):

1. **Pick your content type** (Event, Daily Post, Promo, etc.)
2. **Check the platforms** you want content for
3. **Paste your raw notes** — messy is fine! E.g.:
   > puppy yoga saturday march 22 10am with pawsco rescue free for members $15 drop-in
4. **Tap Generate** 🐾
5. **Copy** the output for each platform and paste into your app
6. **Save as draft** if you want to come back to it

### Tips:
- Use the **🎤 mic button** next to the notes field to dictate on the go
- **Upload a photo** to see a Story text preview and save a composite image
- Check **"This is a paid post"** to generate ad copy variants for A/B testing
- **Set a Post Date** to see your content on the Calendar tab
- After posting, go to the **Performance tab** and rate how it did (1-5 stars)

---

## File Structure

```
homedog-content-generator/
├── index.html          # Main app
├── css/
│   └── style.css       # All styles (mobile-first, dark mode)
├── js/
│   ├── app.js          # App logic, navigation, UI
│   ├── theme.js        # Brand config (colors, copy, links)
│   ├── templates.js    # Content templates, hooks, CTAs
│   ├── hashtags.js     # Hashtag sets and assembly
│   ├── generator.js    # Content generation engine
│   ├── speech.js       # Voice-to-text
│   └── storage.js      # Draft/rating management
└── README.md           # This file
```

## Rebranding for Another Business

All HomeDog-specific values live in `js/theme.js`. To rebrand:

1. Edit `js/theme.js` — change colors, name, address, links, boilerplate
2. Edit `js/templates.js` — update hooks, body templates, and CTAs
3. Edit `js/hashtags.js` — replace hashtag sets
4. That's it — the rest of the app reads from these files

---

## Browser Support

| Platform | Browser | Status |
|----------|---------|--------|
| iPhone | Safari (iOS 15+) | ✅ Full support |
| Android | Chrome (10+) | ✅ Full support |
| Mac | Safari | ✅ Full support |
| Windows | Chrome | ✅ Full support |
| Windows | Edge | ✅ Full support |
| Any | Firefox | ✅ (voice input limited) |

---

Built with ❤️ for the HomeDog pack. Paws has your back.
