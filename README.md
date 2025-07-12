# An application to listen offline music (musicoff)

Listen your favorite music offline with Musicoff. This application allows you to download music from YouTube and listen to it without an internet connection and no ads.

## Get Google API Key

Follow the steps below to get your Google API key: https://developers.google.com/youtube/v3/getting-started

## Features

- Listen offline music
- Download music from youtube
- Automatic top 10 music you listen
- Playlists
- Random music
- Filters, sorts, and search
- Add music to favorites

## Frontend

**Install the dependencies**

```bash
yarn install
```

**Start the app in development mode (hot-code reloading, error reporting, etc.)**

```bash
yarn dev:ios
```

**Build the app for production**

```bash
yarn build:ios
```

## Backend

This application uses a Python backend to handle requests and manage downloads. The unique propuse of the backend is to download music from YouTube and store it locally, you no need a server running all the time, you can run locally only when you need to download music.

```bash
cd server
python3 app.py
```
