# 🌙 Alexis' Wondrous Website

A personal website built as a small corner of the internet to share projects, photography, music, and random creations.

## ✨ Features

* 📝 **Blog**

  * Forum-style threads and replies
  * Visitors can create discussions and interact

* 📷 **Gallery**

  * Personal photography collection
  * Images managed through the backend

* 🎵 **Music Wall**

  * Displays current and recent listening activity using the Last.fm API

* 🧱 **Guestbook**

  * Visitors can leave their name on a virtual brick wall

* 🌐 **Network**

  * A collection of links to my other websites and profiles

## 🛠️ Built With

* React
* React Router
* Supabase
* Vercel
* Last.fm API
* CSS (custom glass / aero inspired design)

## 🚀 Deployment

This site is deployed using Vercel.

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar
│   ├── Sidebar
│   └── Loader
│
├── pages/
│   ├── Home
│   ├── Blog
│   ├── Gallery
│   ├── Guestbook
│   ├── Music
│   └── Links
│
└── App.jsx
```

## 💻 Local Development

Clone the repository:

```bash
git clone https://github.com/iniix-sys/alexis-wondrous-website.git
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

## 📡 Environment Variables

The project uses environment variables for external services:

```
LASTFM_API_KEY=
LASTFM_USERNAME=
```

## 📜 License

This project is personal work. Feel free to look around and use it as inspiration.
