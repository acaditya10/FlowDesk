const express = require("express");
const {
  addComment,
  getComments
} = require("../controllers/ticketComments.controller");
const authenticate = require("../middlewares/auth.middleware");

const router = express.Router();

// add comment
router.post(
  "/tickets/:ticketId/comments",
  authenticate,
  addComment
);

// get comments
router.get(
  "/tickets/:ticketId/comments",
  authenticate,
  getComments
);

module.exports = router;
