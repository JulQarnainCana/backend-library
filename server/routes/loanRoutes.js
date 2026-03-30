const express = require("express");
const router = express.Router();
const {
  borrowBook,
  getLoans,
  returnBook
} = require("../controllers/loanController");

router.post("/borrow", borrowBook);
router.get("/", getLoans);
router.put("/return/:id", returnBook);

module.exports = router;