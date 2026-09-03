<div align="center">

# 🏢 Nexuss

### AI-Powered Coworking Space Booking Platform

A full-stack MERN application for discovering, comparing, and booking coworking spaces, private offices, dedicated desks, and meeting rooms — with AI-powered search built in.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#-license)

[Live Demo](#) · [Report Bug](https://github.com/sanjana-upadhyay/Nexuss/issues) · [Request Feature](https://github.com/sanjana-upadhyay/Nexuss/issues)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 📌 About

**Nexuss** solves a simple problem: finding and booking a coworking space shouldn't require phone calls, emails, or guesswork. It brings together search, filtering, AI-assisted discovery, and instant booking in one clean interface — for both people looking for a desk and owners looking to list one.

Built as a complete production-style MERN application, covering authentication, real-time availability, AI integrations, and role-based dashboards.

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 👤 For Users
- 🔍 Browse & filter workspaces by city, price, amenities
- ✨ AI natural-language search *("quiet space in Indore under ₹500")*
- 📅 Single-day or multi-day booking with live seat availability
- 🚫 Automatic double-booking prevention
- ⭐ Ratings & reviews with AI-generated summaries
- ❤️ Wishlist saved workspaces
- 🧾 Booking history with 24-hour cancellation policy
- 🙍 Editable profile with avatar upload

</td>
<td width="50%" valign="top">

### 🏢 For Owners
- ➕ List spaces with photos, pricing & amenities
- ✨ AI-generated workspace descriptions
- 📊 Revenue & booking analytics dashboard
- 💬 Reply to customer reviews
- 🛠️ Full CRUD on listings
- 🎫 Space types: Hot Desk, Dedicated Desk, Private Cabin, Meeting Room, Managed Office

</td>
</tr>
</table>

### 🌐 Platform-wide
- 🔐 JWT authentication with role-based access (User / Owner / Admin)
- 📱 Fully responsive with mobile navigation
- 🎨 Smooth animations, toast notifications, skeleton loaders

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite), Tailwind CSS, Framer Motion, React Router, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT, bcrypt |
| **File Storage** | Cloudinary |
| **AI** | Google Gemini API |
| **Notifications** | React Hot Toast |

---

## 📸 Screenshots

> _Add screenshots of your Home page, Workspace listing, and Booking flow here._

| Home | Workspace Listing | Booking Details |
|---|---|---|
| ![Home](./screenshots/home.png) | ![Listing](./screenshots/listing.png) | ![Details](./screenshots/details.png) |

---

## 📁 Project Structure

Nexuss/
├── Frontend/ # React + Vite client
│ └── src/
│ ├── pages/ # Route-level pages
│ ├── component/ # Reusable UI components
│ ├── context/ # Auth context/provider
│ ├── services/ # API service layer
│ └── utils/ # Helpers & constants
│
└── Backend/ # Express REST API
├── config/ # DB, Cloudinary, Gemini config
├── controllers/ # Route logic
├── models/ # Mongoose schemas
├── routes/ # API routes
└── middleware/ # Auth & error handling


---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- [Cloudinary](https://cloudinary.com) account
- [Google Gemini API key](https://aistudio.google.com/apikey)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/sanjana-upadhyay/Nexuss.git
cd Nexuss
```

**2. Set up the backend**
```bash
cd Backend
npm install
```

Create a `.env` file (see `.env.example`):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
```

Run the server:
```bash
node server.js
```

**3. Set up the frontend**
```bash
cd ../Frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`, API at `http://localhost:5000`.

---

## 📡 API Reference

<details>
<summary><strong>Auth</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login |
| `GET` | `/api/auth/profile` | Get logged-in profile |
| `PUT` | `/api/auth/profile` | Update profile |

</details>

<details>
<summary><strong>Workspaces</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/workspaces` | List/search workspaces |
| `POST` | `/api/workspaces` | Create workspace (Owner/Admin) |
| `GET` | `/api/workspaces/:id` | Get workspace details |
| `PUT` | `/api/workspaces/:id` | Update workspace |
| `DELETE` | `/api/workspaces/:id` | Delete workspace |

</details>

<details>
<summary><strong>Bookings</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/bookings` | Create a booking |
| `GET` | `/api/bookings/my` | Get my bookings |
| `GET` | `/api/bookings/availability/:workspaceId` | Check seat availability |
| `GET` | `/api/bookings/analytics` | Owner analytics |
| `PUT` | `/api/bookings/:id/cancel` | Cancel booking |

</details>

<details>
<summary><strong>Reviews & Wishlist</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/reviews` | Submit a review |
| `GET` | `/api/reviews/workspace/:id` | Get workspace reviews |
| `PUT` | `/api/reviews/:id/reply` | Owner reply to review |
| `POST` | `/api/wishlist` | Add to wishlist |
| `GET` | `/api/wishlist` | Get wishlist |

</details>

<details>
<summary><strong>AI</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/generate-description` | Generate workspace description |
| `POST` | `/api/ai/recommend` | Natural-language search |
| `GET` | `/api/ai/review-summary/:workspaceId` | Summarize reviews |

</details>

---

## 🗺 Roadmap

- [ ] Payment gateway integration (Razorpay)
- [ ] Email notifications for bookings & reviews
- [ ] Map-based location search
- [ ] Downloadable PDF invoices
- [ ] Email/phone verification

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👩‍💻 Author

**Sanjana Upadhyay**

[![GitHub](https://img.shields.io/badge/GitHub-100000?logo=github&logoColor=white)](https://github.com/sanjana-upadhyay)

<div align="center">

⭐ **If you found this project interesting, consider giving it a star!** ⭐

</div>