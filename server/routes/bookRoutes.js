const express = require("express");
const router = express.Router();
const {
  getBooks,
  addBook,
  updateBook,
  deleteBook
} = require("../controllers/bookController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.get("/", getBooks);
router.post("/", protect, adminOnly, addBook);
router.put("/:id", protect, adminOnly, updateBook);
router.delete("/:id", protect, adminOnly, deleteBook);

module.exports = router;