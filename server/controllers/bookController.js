const Book = require("../models/Book");

const getBooks = async (req, res) => {
  try {
    const {
      search,
      title,
      author,
      isbn,
      available,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // Search by title, author, isbn, or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Individual filters
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (author) {
      query.author = { $regex: author, $options: "i" };
    }

    if (isbn) {
      query.isbn = { $regex: isbn, $options: "i" };
    }

    // Availability filter
    if (available !== undefined) {
      if (available === "true") {
        query.availableCopies = { $gt: 0 };
      } else if (available === "false") {
        query.availableCopies = 0;
      }
    }

    // Allowed sort fields
    const allowedSortFields = ["createdAt", "title", "author", "copies", "availableCopies"];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.max(Number(limit) || 10, 1);
    const skip = (pageNumber - 1) * limitNumber;

    const totalBooks = await Book.countDocuments(query);

    const books = await Book.find(query)
      .sort({ [finalSortBy]: sortOrder })
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      totalBooks,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalBooks / limitNumber),
      count: books.length,
      books
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addBook = async (req, res) => {
  try {
    const data = req.body;

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return res.status(400).json({ message: "Books array is empty" });
      }

      for (const book of data) {
        const { title, author, isbn, description, image, copies } = book;

        if (!title || !author || !isbn || !description || !image || !copies) {
          return res.status(400).json({
            message: "Each book must have title, author, isbn, description, image, and copies"
          });
        }

        if (Number(copies) < 1) {
          return res.status(400).json({
            message: `Copies must be at least 1 for ISBN: ${isbn}`
          });
        }
      }

      const isbns = data.map((book) => book.isbn);
      const existingBooks = await Book.find({ isbn: { $in: isbns } });

      if (existingBooks.length > 0) {
        return res.status(400).json({
          message: "Some books already exist",
          existingISBNs: existingBooks.map((book) => book.isbn)
        });
      }

      const booksToInsert = data.map((book) => ({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: book.description,
        image: book.image,
        copies: Number(book.copies),
        availableCopies: Number(book.copies)
      }));

      const insertedBooks = await Book.insertMany(booksToInsert);

      return res.status(201).json({
        message: "Books added successfully",
        count: insertedBooks.length,
        books: insertedBooks
      });
    }

    const { title, author, isbn, description, image, copies } = data;

    if (!title || !author || !isbn || !description || !image || !copies) {
      return res.status(400).json({
        message: "Please fill in all required fields"
      });
    }

    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({
        message: "Book already exists"
      });
    }

    const parsedCopies = Number(copies);

    if (isNaN(parsedCopies) || parsedCopies < 1) {
      return res.status(400).json({
        message: "Copies must be at least 1"
      });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      description,
      image,
      copies: parsedCopies,
      availableCopies: parsedCopies
    });

    return res.status(201).json({
      message: "Book added successfully",
      book
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, description, image, copies } = req.body;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (isbn && isbn !== book.isbn) {
      const existingBook = await Book.findOne({ isbn });
      if (existingBook) {
        return res.status(400).json({ message: "ISBN already exists" });
      }
    }

    if (copies !== undefined) {
      const parsedCopies = Number(copies);

      if (isNaN(parsedCopies) || parsedCopies < 1) {
        return res.status(400).json({
          message: "Copies must be at least 1"
        });
      }

      const borrowedCopies = book.copies - book.availableCopies;

      if (parsedCopies < borrowedCopies) {
        return res.status(400).json({
          message: `Copies cannot be less than borrowed copies (${borrowedCopies})`
        });
      }

      book.copies = parsedCopies;
      book.availableCopies = parsedCopies - borrowedCopies;
    }

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (isbn !== undefined) book.isbn = isbn;
    if (description !== undefined) book.description = description;
    if (image !== undefined) book.image = image;

    await book.save();

    res.status(200).json({
      message: "Book updated successfully",
      book
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.deleteOne();

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook
};