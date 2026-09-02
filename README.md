# Musicloggr

[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen.svg)](https://musicloggr.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Musicloggr** is a social web application designed for music enthusiasts. It allows users to track their listening habits, curate a personal music log, search and discover records via the MusicBrainz API, and engage with the community through reviews, ratings, comments, and social follows.

**Live application:** [musicloggr.com](https://musicloggr.com)

---

## Key Features

* **User Profiles & Social Network:** Create and manage your profile, follow other users, and keep up with their latest activity.
* **Personal Music Log:** Save, catalog, and track albums you have listened to.
* **MusicBrainz Integration:** Real-time search for releases, artists, and tracklists using the open [MusicBrainz Database](https://musicbrainz.org/).
* **Reviews & Ratings:** Write and publish reviews on records in your own log or discovered on other profiles.
* **Community Discussions:** Comment on reviews to start music discussions with other users.
* **Real-time Notifications:** Receive updates whenever someone follows you or comments on your reviews.

---

## Tech Stack

### Frontend
* **React** (SPA)
* **React Router**
* **Axios** / Fetch API for HTTP requests

### Backend
* **Ruby on Rails** (API Mode)
* **PostgreSQL** (Relational Database)
* **Devise / JWT** 
* **MusicBrainz API** (External data provider)

---

## Prerequisites

Ensure you have the following installed locally:

* **Ruby** (`>= 3.x`)
* **Rails** (`>= 7.x`)
* **Node.js** (`>= 18.x`) & **npm** or **yarn**
* **PostgreSQL** running locally

---

## Getting Started

### 1. Clone the repository
```bash
git clone [https://github.com/DaveBett/musicloggr.git](https://github.com/DaveBett/musicloggr.git)
cd musicloggr
