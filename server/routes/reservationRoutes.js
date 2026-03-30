const express = require("express");
const router = express.Router();
const {
  createReservation,
  getReservations,
  cancelReservation,
  fulfillReservation
} = require("../controllers/reservationController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.post("/", createReservation);
router.get("/", getReservations);
router.put("/cancel/:id", cancelReservation);
router.put("/fulfill/:id", protect, adminOnly, fulfillReservation);

module.exports = router;