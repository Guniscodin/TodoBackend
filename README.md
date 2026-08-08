# 📝 Todo Backend

A production-style Todo REST API built with **Express**, **MongoDB**, **Mongoose**, and **TypeScript**.

Originally started as a simple Todo backend for practice. It has since developed authentication, sessions, refresh token rotation, transactions, rate limiting, validation, and other things that probably weren't necessary for a Todo app.

---

## ✨ Features

- 🔐 JWT authentication
- 🔄 Access & refresh token system
- 🔁 Refresh token rotation
- 👤 Session management
- 🛡️ User authorization
- ✅ Full CRUD operations for tasks
- 📄 Cursor-based pagination
- ✔️ Input validation
- 🚦 Rate limiting
- 🔒 Password hashing with Argon2
- 💾 MongoDB transactions
- 🧹 TTL-based token and session cleanup
- 🛡️ Security middleware
- 📡 REST API
- 🦺 Type-safe TypeScript codebase

---

## 🛠️ Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Argon2](https://img.shields.io/badge/Argon2-D22128?style=for-the-badge&logo=letsencrypt&logoColor=white)

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone <your-repo-url>
cd <repo-name>
npm install
```

Create a `.env` file and add the required environment variables.

Start the development server:

```bash
npm run dev
```

---

## 📂 Project Goal

This project started as a way to practice building a Todo API with TypeScript, Express, MongoDB, and Mongoose.

The goal is to gradually turn it into a production-style backend while learning and implementing real-world backend concepts such as authentication, authorization, session management, token rotation, database transactions, pagination, validation, rate limiting, and scalable API design.

In other words:

> It's just a Todo app. I swear.