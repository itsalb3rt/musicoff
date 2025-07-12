# 🎵 Musicoff – Listen to Your Favorite Music Offline

[![License](https://img.shields.io/github/license/itsalb3rt/musicoff)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/itsalb3rt/musicoff?style=social)](https://github.com/itsalb3rt/musicoff/stargazers)
[![GitHub Sponsors](https://img.shields.io/badge/sponsor-❤️-brightgreen?style=flat&logo=github)](https://github.com/sponsors/itsalb3rt)

Musicoff is a simple, beautiful app that lets you **download music from YouTube** and listen to it **offline without ads**. It’s fully open source and built to give you freedom over your music.

<img src="/docs/1.jpeg" alt="Musicoff Screenshot 1" width="300">
<img src="/docs/2.jpeg" alt="Musicoff Screenshot 2" width="300">
<img src="/docs/3.jpeg" alt="Musicoff Screenshot 3" width="300">
<img src="/docs/4.jpeg" alt="Musicoff Screenshot 4" width="300">

---

## ✨ Features

- 🎧 Listen to music offline
- ⬇️ Download music directly from YouTube
- 📈 Auto-generated Top 10 list based on your listening habits
- 🎶 Playlist management
- 🔀 Shuffle and random playback
- 🔍 Filters, sorting, and search
- ❤️ Add songs to your favorites

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/itsalb3rt/musicoff.git
cd musicoff
```

### 2. Get a Google API Key

To enable YouTube access, follow these steps to get your [Google API key](https://developers.google.com/youtube/v3/getting-started).

---

## 📱 Frontend Setup

### Install dependencies

```bash
yarn install
```

### Start in development mode

```bash
yarn dev:ios
```

### Build for production

```bash
yarn build:ios
```

---

## 🐍 Backend (Python)

The backend handles downloading music from YouTube. You only need to run it when you're downloading songs—**no need to keep a server running all the time**.

```bash
cd server
python3 app.py
```

---

## 🤝 Contributing

We welcome contributions of all kinds! Whether it's fixing a bug, improving documentation, or adding a new feature — we’d love your help.

### To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Submit a Pull Request 🙌

Please read our `CONTRIBUTING.md` (coming soon) for more details.

---

## 💖 Support the Project

If you like Musicoff and want to support its development, consider becoming a sponsor!

> 📢 [**Become a GitHub Sponsor**](https://github.com/sponsors/itsalb3rt) to support continued development and get a shoutout in the project!

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
