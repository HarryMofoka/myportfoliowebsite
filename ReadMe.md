# Liquid OS Portfolio

![Project Status](https://img.shields.io/badge/status-active-success?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![v1.0.0](https://img.shields.io/badge/version-1.0.0-lightgrey?style=flat-square)

> **A high-performance, web-based operating system interface designed as an interactive developer portfolio.**

Liquid OS pushes the boundaries of standard web portfolios by immersing the visitor in a fully functional desktop environment right in the browser. Built with vanilla JavaScript and modern CSS, it prioritizes liquid-smooth 60fps animations, intuitive window management, and real-time system integrations without the bloat of heavy frameworks.

---

## 📑 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Architecture Highlights](#-architecture-highlights)
- [Project Structure](#-project-structure)
- [Customization](#-customization)
- [APIs & Libraries](#-apis--libraries)
- [License](#-license)

---

## 🔭 Overview

Liquid OS serves as both a showcase of technical capability and a unique way to present professional information. Instead of scrolling through a static page, users "boot up" the system, unlock a secure desktop, and explore applications that represent different facets of the developer's profile (Projects, About, Contact).

It is designed to feel native, utilizing hardware acceleration for animations, managing complex state (window z-indexing, minimized apps), and interacting with browser APIs (Battery Status, Geolocation).

---

## ✨ Key Features

### 🖥 Desktop Environment
- **Lock Screen:** Secure entry point with real-time clock and date.
- **Parallax Wallpaper:** Subtle depth effect that responds to mouse movement.
- **Dynamic Dock:** macOS-inspired dock with 3D tilt hover effects and elastic magnification.
- **Menu Bar:** Persistent top bar showing active window capability, real-time battery level (using the Battery Status API), and system time.

### 🪟 Window Management System
- **Draggable & Resizable:** Full support for moving windows and maximizing them to fill the available desktop space.
- **Z-Index Stacking:** Active windows automatically come to the foreground when clicked.
- **State Management:** Minimize, maximize, and close functionalities with smooth GSAP transitions.

### 📱 Integrated Applications
| App | Description |
| :--- | :--- |
| **Finder** 🔎 | Universal search bar that indexes all apps, projects, and settings for quick navigation. |
| **Weather** ⛅ | Real-time weather using Geolocation and the Open-Meteo API. No API key required. |
| **Projects** 🚀 | A dynamic grid rendering project data from a JSON object, featuring specialized detail views. |
| **Settings** ⚙️ | System preferences control panel: toggle Dark Mode, adjust Glassmorphism blur intensity, and change wallpapers. |
| **About** 👤 | Profile overview, bio, and skill badges. |
| **Contact** ✉️ | Glassmorphic message composition window. |

### 🔊 Interactive Sound Design
- **Startup/Shutdown Sequences:** Immersive audio cues using Tone.js.
- **UI Feedback:** Subtle click and unlock sounds enhance tactility.

---

## 🛠 Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

- **Core:** Semantic HTML5, Modern CSS3 (Variables, Flexbox, Grid).
- **Scripting:** Pure Vanilla JavaScript (ES6+).
- **Styling Architecture:** Glassmorphism UI utilizing `backdrop-filter: blur()`.
- **Animation Engine:** [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/) for complex timelines and physics-based transitions.
- **Audio Engine:** [Tone.js](https://tonejs.github.io/) for synthesized system sounds.

---

## ⚡ Installation & Setup

This project is static and requires no build process or backend server.

### Option 1: Run Locally
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/liquid-os.git](https://github.com/yourusername/liquid-os.git)
    ```
2.  **Navigate to the directory:**
    ```bash
    cd liquid-os
    ```
3.  **Launch:**
    Open `index.html` in any modern web browser.
    *Note: For features like Geolocation to work without permission errors, it is recommended to use a local development server (like Live Server for VS Code) rather than just opening the file path.*

### Option 2: Deploy
Simply upload the entire project folder to any static host:
- GitHub Pages
- Netlify
- Vercel

---

## 🏗 Architecture Highlights

### The "No-Framework" Approach
Liquid OS intentionally eschews frameworks like React or Vue to demonstrate mastery of the DOM and native Web APIs. State (like which window is active or dark mode preferences) is managed via javascript objects and `localStorage` rather than complex reducers.

### Dynamic Search Indexing
The Finder app doesn't just hardcode results; it aggregates data from multiple sources (App list, Project JSON data, Settings options) into a single searchable array on initialization, allowing for instant, filterable results.

```javascript
// Example of how data is aggregated for the Finder
const SEARCHABLE_DATA = [
    ...APPS_LIST,
    ...PROJECTS_DATA.map(p => ({ type: 'project', ...p })),
    ...SETTINGS_OPTIONS
];