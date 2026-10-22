
const dns = require("node:dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Book schema
const bookSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        author: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

// CREATE - Insert one book
app.post("/books", async (req, res) => {
    try {
        const { name, author } = req.body;

        if (!name?.trim() || !author?.trim()) {
            return res.status(400).json({
                message: "Book name and author are required"
            });
        }

        const book = await Book.create({
            name: name.trim(),
            author: author.trim()
        });

        res.status(201).json({
            message: "Book added successfully",
            book
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add book" });
    }
});

// BULK CREATE - Insert multiple books
app.post("/books/bulk", async (req, res) => {
    try {
        const books = req.body;

        if (!Array.isArray(books) || books.length === 0) {
            return res.status(400).json({
                message: "Send a non-empty array of books"
            });
        }

        if (books.some(book =>
            !book ||
            typeof book.name !== "string" ||
            typeof book.author !== "string" ||
            !book.name.trim() ||
            !book.author.trim()
        )) {
            return res.status(400).json({
                message: "Every book must have a name and author"
            });
        }

        const insertedBooks = await Book.insertMany(
            books.map(book => ({
                name: book.name.trim(),
                author: book.author.trim()
            }))
        );

        res.status(201).json({
            message: "Books inserted successfully",
            count: insertedBooks.length,
            books: insertedBooks
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Failed to insert books",
            error: error.message
        });
    }
});

// READ - Get all books
app.get("/books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch books" });
    }
});

// READ - Get one book
app.get("/books/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID" });
        }

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch book" });
    }
});

// UPDATE - Edit a book
app.put("/books/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID" });
        }

        const { name, author } = req.body;

        if (typeof name !== "string" ||
            typeof author !== "string" ||
            !name.trim() ||
            !author.trim()) {
            return res.status(400).json({
                message: "Book name and author are required"
            });
        }

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { name: name.trim(), author: author.trim() },
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book updated successfully", book });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update book" });
    }
});

// DELETE - Remove a book
app.delete("/books/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid book ID" });
        }

        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete book" });
    }
});

// Start server after MongoDB connects
async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from .env");
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Atlas connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

startServer();
