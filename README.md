# Hotel Booking System – Frontend

## 1. Overview

This is the frontend application of the Hotel Booking System.

The frontend provides:

- User interface for customers
- Admin dashboard interface
- Authentication (User & Admin)
- Hotel browsing and booking UI

---

## 2. Tech Stack

- React 18+
- TypeScript
- Vite
- React Router
- Axios

### Runtime Requirements

- Node.js >= 18.x
- npm >= 9.x

---

## 3. Installation

Install dependencies:

```bash
npm install
```

---

## 4. Run Development Server

```bash
npm run dev
```

Default URL:

```
http://localhost:5173
```

---

## 5. Production Build

Build the application:

```bash
npm run build
```

The production files will be generated inside:

```
dist/
```

Deploy the `dist` folder to Nginx or Apache.

---

## 6. Application Routes

| Route | Description |
|--------|------------|
| `/` | User homepage |
| `/login` | User login |
| `/admin/login` | Admin login page |
| `/admin` | Admin dashboard (requires admin authentication) |

---

## 7. Demo Accounts

### User Account
- Email: 2251052022dun@ou.edu.vn
- Password: Admin@123

### Admin Account
- Email: mathilde.emard@example.com
- Password: 123456

### Payment Accounts
- https://sandbox.vnpayment.vn/apis/vnpay-demo/

---

## 8. Environment Configuration

Create a `.env` file:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

Adjust API URL according to your backend deployment.

---

## 9. Notes

- Backend must be running before starting frontend.
- Always run `npm run build` before deploying to production.
- Server must redirect all routes to `index.html` for React Router to work properly.
- Project is in progress, please fogive me if it does not work.

---


## 10. Link Demo
User Demo: http://www.hotel.duckou.id.vn/
Admin Demo: http://www.hotel.duckou.id.vn/admin/login  
