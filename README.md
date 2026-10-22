# MongoDB Book Library CRUD App

A simple Node.js + Express + MongoDB application for managing a library of books. It includes a small front-end interface for creating, reading, updating, and deleting books.

## Features

- Add a new book
- View all books
- Edit an existing book
- Delete a book
- MongoDB persistence using Mongoose
- REST API endpoints for book operations

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- HTML/CSS/JavaScript (frontend)

## Project Structure

```text
.
├── index.html
├── server.js
├── package.json
├── .env
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- MongoDB database available
- A MongoDB connection string

## Setup

1. Open a terminal in the project folder.
2. Install the dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/library
```

You can replace the connection string with your own MongoDB Atlas or local MongoDB URI.

## Run the app

Start the server with:

```bash
npm start
```

The app will run on:

```text
http://localhost:5000
```

## API Endpoints

### Get all books

```http
GET /books
```

### Create a book

```http
POST /books
```

Request body example:

```json
{
  "name": "The Alchemist",
  "author": "Paulo Coelho"
}
```

### Update a book

```http
PUT /books/:id
```

### Delete a book

```http
DELETE /books/:id
```

## Notes

- The app serves the frontend from the project root using Express static files.
- The MongoDB connection is created automatically when the server starts.
- If the connection fails, check your `MONGODB_URI` value and MongoDB server status.

## License

This project is licensed under the ISC license.
