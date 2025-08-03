# File Transfer Service – Frontend

This is the **React-based frontend** for the `file-transfer-service`, a simple file-sending tool that lets users send files via email using a backend powered by `nodemailer` and `multer`. No login or signup is required. Files are transferred securely with a one-time password validated from the `.env` config.

## 🌐 Features

- Upload and send up to 10 files to any valid email address.
- Email is sent via SMTP configured in the backend.
- No user registration or login required.
- Secure: a password is checked before sending (provided via POST and compared to `.env`).
- Responsive and minimal UI built using **React**.

---

## 📁 Folder Structure
```
file-transfer-service-frontend/
├── src/
│ ├── CSS/
│ │ └── fileServiceUI.css
│ ├── App.jsx
│ ├── FileServiceUI.jsx
│ ├── index.css
│ └── main.jsx
├── .gitignore
├── LICENSE
├── README.md
├── eslint.config.js
├── index.html
├── .env
├── package-lock.json
├── package.json
└── vite.config.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory with:

---

```env
VITE_BACKEND_URL= localhost_backend_URL or Deployed_Backend_URL
```
---
## 🚀 Running the Project

### 1. Install dependencies:
```bash
npm install
```

### 2. Run the development server:
```bash
npm run dev
```

---

## 🛡️ Security Note
-Even though the app allows sending without login, a POST-based password protection is implemented in the backend to prevent abuse.

---

