const Reservation = require("../models/Reservation");
const Book = require("../models/Book");
const User = require("../models/User");

const createReservation = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({
        message: "userId and bookId are required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    if (book.availableCopies > 0) {
      return res.status(400).json({
        message: "Book is available. You can borrow it instead of reserving."
      });
    }

    const existingReservation = await Reservation.findOne({
      user: userId,
      book: bookId,
      status: "pending"
    });

    if (existingReservation) {
      return res.status(400).json({
        message: "You already have a pending reservation for this book"
      });
    }

    const reservation = await Reservation.create({
      user: userId,
      book: bookId
    });

    const populatedReservation = await Reservation.findById(reservation._id)
      .populate("user", "name email role")
      .populate("book", "title author isbn image");

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: populatedReservation
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "name email role")
      .populate("book", "title author isbn image")
      .sort({ createdAt: -1 });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found"
      });
    }

    if (reservation.status === "cancelled") {
      return res.status(400).json({
        message: "Reservation is already cancelled"
      });
    }

    if (reservation.status === "fulfilled") {
      return res.status(400).json({
        message: "Fulfilled reservation cannot be cancelled"
      });
    }

    reservation.status = "cancelled";
    await reservation.save();

    const updatedReservation = await Reservation.findById(reservation._id)
      .populate("user", "name email role")
      .populate("book", "title author isbn image");

    res.status(200).json({
      message: "Reservation cancelled successfully",
      reservation: updatedReservation
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const fulfillReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found"
      });
    }

    if (reservation.status === "cancelled") {
      return res.status(400).json({
        message: "Cancelled reservation cannot be fulfilled"
      });
    }

    if (reservation.status === "fulfilled") {
      return res.status(400).json({
        message: "Reservation is already fulfilled"
      });
    }

    const book = await Book.findById(reservation.book);
    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    if (book.availableCopies < 1) {
      return res.status(400).json({
        message: "No available copies to fulfill this reservation"
      });
    }

    reservation.status = "fulfilled";
    await reservation.save();

    book.availableCopies -= 1;
    await book.save();

    const updatedReservation = await Reservation.findById(reservation._id)
      .populate("user", "name email role")
      .populate("book", "title author isbn image");

    res.status(200).json({
      message: "Reservation fulfilled successfully",
      reservation: updatedReservation
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createReservation,
  getReservations,
  cancelReservation,
  fulfillReservation
};