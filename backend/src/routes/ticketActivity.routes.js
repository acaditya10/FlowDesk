const express = require("express");
const { getTicketActivity } = require("../controllers/ticketActivity.controller");
const authenticate = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/tickets/:ticketId/activity",
  authenticate,
  getTicketActivity
);

module.exports = router;
