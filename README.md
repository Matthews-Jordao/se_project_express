# WTWR (What To Wear?) - Backend

## About

This is the Express server for my WTWR project. It handles all the API stuff - user accounts, authentication, and managing clothing items. Everything gets stored in MongoDB.

## Links

**Frontend repo:** https://github.com/Matthews-Jordao/se_project_react

## What it does

- User signup and login with bcrypt password hashing
- JWT tokens for staying logged in
- CRUD for clothing items
- Like/unlike items
- Update profile info
- Validates emails and URLs

## Tech

- Node.js / Express
- MongoDB with Mongoose
- JWT for auth
- bcryptjs for passwords
- validator for input checking

## API Routes

Public (no auth needed):

- `POST /signup` - create account
- `POST /signin` - login, get token
- `GET /items` - get all clothes

Need to be logged in:

- `GET /users/me` - get your info
- `PATCH /users/me` - update profile
- `POST /items` - add new item
- `DELETE /items/:id` - delete your item
- `PUT /items/:id/likes` - like item
- `DELETE /items/:id/likes` - unlike item

## Running it

Make sure MongoDB is running, then:

```bash
npm install
npm run dev
```

Server runs on port 3001.
