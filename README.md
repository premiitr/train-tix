
# 🚆 TrainTix - Smart Seat Reservation System

TrainTix is a full-stack web application for booking train seats with smart allocation logic and role-based access (Admin/Customer). Built as part of the Workwise SDE 1 Assignment.

---

## 🧠 Features

- 🔐 **User Authentication** (Login/Signup)
- 🪑 **Smart Seat Booking**
  - Books closest available and adjacent seats
  - Max 7 seats per booking
- 🎯 **Role-Based Access**
  - Admin can reset all bookings
- 💺 **Live Seat Layout**
  - Green: Available  
  - Red: Booked by others  
  - Yellow: Booked by you
- ♻️ **Cancel Seats**
  - Cancel specific or all booked seats
- 💾 **Persistence**
  - Bookings stored in PostgreSQL
  - Redux-managed global state
- 💻 **Fully Responsive UI**

---

## 🛠 Tech Stack

| Frontend   | Backend        | Database   | State Management |
|------------|----------------|------------|------------------|
| React.js   | Node.js + Express | PostgreSQL | Redux Toolkit  |

---

## 🖼 Screenshots

| Booking Panel | Admin Panel | Seat Layout |
|---------------|-------------|--------------|
| ![booking](./screenshots/booking.png) | ![admin](./screenshots/admin.png) | ![layout](./screenshots/layout.png) |

---

---

## 🧪 How to Run Locally

### 1. Clone Repo
```bash
git clone https://github.com/premiitr/traintix.git
cd traintix
```

### 2. Setup Frontend
```bash
cd client
npm install
npm start
```

### 3. Setup Backend
```bash
cd server
npm install
node server.js
```

### 4. PostgreSQL Setup
```sql
CREATE DATABASE traintix;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  booked_seats TEXT[]
);
```

---

## 📦 API Endpoints

| Method | Endpoint         | Description               |
|--------|------------------|---------------------------|
| POST   | `/register`      | Register new user         |
| POST   | `/login`         | Login existing user       |
| POST   | `/book`          | Book seats                |
| POST   | `/cancel`        | Cancel user’s booked seats |
| POST   | `/reset_all`     | Admin resets all bookings |
| GET    | `/booked_seats`  | Get all booked seats      |

---

## 👨‍💻 Admin Credentials

```bash
Email: admin@traintix.com
Password: any
```