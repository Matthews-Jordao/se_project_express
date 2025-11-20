# WTWR (What to Wear?): Back End

## Description
This is the back-end server for the WTWR (What to Wear?) application. I built this Express.js server to handle all the API functionality that the frontend needs to work properly. The server manages user authentication, allows users to manage their profiles, and handles all operations for clothing items including creating, deleting, and liking items. It uses JWT tokens to keep users logged in securely and MongoDB to store all the data.

## Technologies & Techniques
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework for building the API
- **MongoDB** - NoSQL database for storing user and clothing item data
- **Mongoose** - ODM (Object Document Mapper) for working with MongoDB schemas
- **JWT (JSON Web Tokens)** - Secure way to handle user authentication and authorization
- **bcryptjs** - Used to hash passwords before storing them in the database
- **CORS** - Allows requests from my frontend application
- **Validator** - Package for validating email addresses and URLs
- **ESLint** - Code linter to maintain code quality and consistency

## Features
- User authentication with email and password
- Secure JWT token-based login system
- User can create an account, view their profile, and update profile information
- Full CRUD operations for clothing items
- Users can like and unlike clothing items
- Comprehensive error handling with specific, helpful error messages
- Input validation for all user data

## Running the Project
- `npm run start` — launches the server on localhost:3001
- `npm run dev` — launches the server with hot reload enabled (great for development)
- `npm run lint` — runs the linter to check for code issues

## Project Demo
Check out this video walkthrough where I explain how the app works:
[WTWR Back End Demo](https://www.loom.com/share/0b675465733d4ccabada30022806fcff)

## API Endpoints

### Authentication Routes (No Authorization Required)
- `POST /signin` - Logs in an existing user and returns a JWT token
- `POST /signup` - Creates a new user account with email, password, name, and avatar URL

### User Routes (Authorization Required)
- `GET /users/me` - Returns the current logged-in user's information
- `PATCH /users/me` - Updates the current user's profile (name and avatar)

### Clothing Items Routes
- `GET /items` - Returns all clothing items in the database (no authorization needed)
- `POST /items` - Creates a new clothing item (authorization required)
- `DELETE /items/:id` - Deletes a clothing item by ID, only if you created it (authorization required)
- `PUT /items/:id/likes` - Adds a like to a clothing item (authorization required)
- `DELETE /items/:id/likes` - Removes a like from a clothing item (authorization required)
