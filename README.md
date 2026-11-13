# BookBazar (BorrowBox) - Pakistan's Student Used Book Marketplace

A modern, responsive, full-stack marketplace platform tailored for Pakistani students to buy and sell used books and textbooks directly from each other across all major national boards and universities.

---

## 🌟 Key Features

1. **User Authentication & Unified Dual Roles:**
   - Single account acts as both Buyer and Seller.
   - Profile management with Pakistani mobile numbers, WhatsApp, city, institute/college, and campus area.
   - JWT-based authentication with token rotation.

2. **Seller Dashboard & Book Management:**
   - Add, edit, pause, and mark books as sold.
   - Track views, status, and buyer unlock requests.

3. **Curriculum-Tailored Book Listing Form:**
   - Pre-configured Pakistani education levels: Matric (Class 9 & 10), FSc/ICS/FA (11th & 12th), O/A Levels, MDCAT/ECAT, University/BS.
   - Education boards: Punjab Textbook Board, Federal (FBISE), Sindh, KPK, Balochistan, Cambridge CIE, HEC.
   - Condition indicators: Brand New, Like New, Good, Fair, Heavily Used.
   - Asking price and original retail price with automated discount calculation.

4. **Barcode & ISBN Scanning Support:**
   - Real-time camera barcode scanner (`html5-qrcode`).
   - Automated book metadata lookup via Open Library and Google Books API for instant auto-filling.

5. **Cover Image Upload & AI Recognition Hook:**
   - Upload book cover photos.
   - Extensible modular image recognition service architecture (`BookCoverRecognitionService`) ready for Google Cloud Vision / Gemini Multimodal API.

6. **Search & Multi-Attribute Filtering:**
   - Filter by keyword, class/grade, education board, subject, condition, Pakistani city, and price range.
   - Search results display **individual sellers and separate listings** with seller profile badges.

7. **Locked Contact Section & Rs. 100 Platform Fee Workflow:**
   - **Business Rule:** Platform does not own or stock books; buyers and sellers handle book price directly.
   - Seller phone number, WhatsApp link, and campus location remain strictly **locked and private**.
   - Buyers submit a Rs. 100 contact-access fee via JazzCash, Easypaisa, or Raast.
   - **No fake payment success:** Includes real Transaction ID submission and admin/gateway verification queue.

8. **Admin Dashboard:**
   - Manage users (ban/unban, view stats).
   - Moderate book listings (pause, activate, delete).
   - Review user reports and flags.
   - **1-Click Payment Verification Queue:** Verify or reject submitted Rs. 100 payments to unlock contacts.

9. **Google AdSense Preparation:**
   - Clearly separated `AdSensePlaceholder` components for top and bottom ad placements.
   - Standard formats (`leaderboard`, `rectangle`, `banner`) without fake ads or hardcoded scripts.

10. **Modern Mobile-First Responsive Design:**
    - React.js with Bootstrap 5 and Bootstrap Icons.
    - Mobile bottom floating navigation for smartphones.

---

## 🛠️ Technology Stack

- **Frontend:** React.js, Vite, Bootstrap 5, Bootstrap Icons, Axios, React Router v7, HTML5-QRCode.
- **Backend:** Python 3, Django 6, Django REST Framework, Simple JWT, CORS Headers, Pillow, python-dotenv.
- **Database:** PostgreSQL (with automatic zero-setup SQLite fallback for local development).
- **Payment Gateways Architecture:** JazzCash, Easypaisa Open API v2, Raast.

---

## 🚀 Quick Start Guide

### 1. Backend Setup

```bash
cd backend

# Create virtual environment (optional)
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed sample Pakistani student listings, users, and transactions
python manage.py seed_data

# Run the Django development server
python manage.py runserver 127.0.0.1:8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install npm packages
npm install

# Run Vite dev server
npm run dev
```

The frontend will be available at: `http://localhost:5173`
The backend API will be available at: `http://127.0.0.1:8000/api/`

---

## 🔑 Demo Accounts (Pre-Seeded)

| Role | Username | Password | Notes |
|---|---|---|---|
| **Admin** | `admin` | `admin123` | Full access to Admin Dashboard & Payment Queue |
| **Seller** | `zainab_pu` | `password123` | Punjab University Pre-Medical Student |
| **Seller** | `ali_nust` | `password123` | NUST Islamabad Engineering Student |
| **Buyer** | `bilal_buyer` | `password123` | PGC Rawalpindi Student with sample unlock requests |

---

## 📁 Project Structure

```text
├── backend/
│   ├── accounts/              # Custom User model, dual-role profile & Admin REST API
│   ├── books/                 # Book listings, ISBN lookup, AI recognition hook
│   ├── payments/              # Rs. 100 Contact Unlock, JazzCash & Easypaisa gateways
│   ├── reports/               # User moderation reports
│   ├── bookbazar_backend/     # Django settings, URLs, WSGI
│   ├── .env.example           # Environment variables template
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # AdSensePlaceholder, BookCard, IsbnScannerModal, ContactUnlockModal, ReportListingModal
│   │   │   └── layout/        # Navbar, Footer, MobileNav
│   │   ├── context/           # AuthContext (JWT management)
│   │   ├── pages/             # Home, Browse, Detail, Sell, Dashboards, Auth & Legal
│   │   ├── services/          # Axios API endpoints (bookService, paymentService, adminService)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 📄 License

Developed for Pakistani students. Open source under the MIT License.
