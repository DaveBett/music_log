# Musicloggr

[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen.svg)](https://musicloggr.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Musicloggr** is a full-stack social web application designed for music enthusiasts. It enables users to curate personal music collections, track listening habits, discover records via the MusicBrainz API, and interact with the community through reviews, ratings, and social follows.

**Live Application:** [musicloggr.com](https://musicloggr.com)  
**Repository:** [github.com/DaveBett/music_log](https://github.com/DaveBett/music_log)

---

<img width="1572" height="852" alt="Musicloggr" src="https://github.com/user-attachments/assets/8e8382d7-34f9-4f30-aaca-6a8c5f276c20" />

---

## Key Features

* **User Profiles & Social Network:** Create custom profiles, follow other music enthusiasts, and track activity feeds.
* **Personal Music Collection:** Add, categorize, and curate records in a personal catalog.
* **MusicBrainz Integration:** Query release groups, artists, and tracklists in real time using the open [MusicBrainz Database](https://musicbrainz.org/).
* **Reviews & Ratings:** Publish long-form reviews and ratings on albums directly from the catalog or personal log.
* **Community Discussions:** Interactive comment threads on community reviews.
* **Real-time Notifications:** Automated alerts for new followers and comments on published reviews.

---

## Architecture & Engineering Highlights

* **Decoupled System Design:** Independent Rails API backend deployed on **Render** serving a client-side React SPA deployed on **Netlify**.
* **Stateless Authentication:** Secure session management implemented with **Devise** and **JWT (JSON Web Tokens)** passed via HTTP `Authorization: Bearer` headers.
* **External API Handling:** Asynchronous metadata retrieval from the MusicBrainz REST API with upstream query optimizations and payload formatting.
* **Relational Schema Design:** Normalized PostgreSQL schema handling user libraries, complex review threads, and self-referential user-follow relationships.
* **Environment-Specific Databases:** Configured development workflows on local MySQL with zero-downtime production migrations on PostgreSQL.

---

## Tech Stack

### Frontend
* **React** (SPA)
* **React Router**
* **Tailwind CSS / CSS Modules**
* **Axios** (HTTP client with JWT interceptors)

### Backend
* **Ruby on Rails** (API-only Mode)
* **PostgreSQL** (Production on Render) / **MySQL** (Development)
* **Devise & devise-jwt**
* **MusicBrainz REST API**

---

## Prerequisites

Ensure you have the following installed locally:

* **Ruby:** `>= 3.0`
* **Rails:** `>= 7.0`
* **Node.js:** `>= 18.x` & **npm** / **yarn**
* **MySQL** (for local development) or **PostgreSQL**

---

## Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/DaveBett/music_log.git
cd music_log
```
### 2. Backend Setup (Rails API in Root)
```bash
# Install Ruby dependencies
bundle install

# Set up environment variables
cp .env.example .env

# Database setup (create, migrate, and seed data)
rails db:create
rails db:migrate
rails db:seed

# Start the Rails server
rails server -p 3001
```
### 3. Frontend Setup (React SPA)
```bash
# Navigate to the frontend directory
cd frontend

# Install JavaScript dependencies
npm install

# Start the development server
npm start
```

---

## Upcoming Improvements

* **Automated Testing:** Implementing backend model and request specs with RSpec and frontend component testing using React Testing Library.
* **Continuous Integration:** Setting up GitHub Actions workflows for automated linting and test runs on pull requests.
* **Caching Layer:** Adding Redis to cache frequent MusicBrainz release group queries and reduce outbound API load.
