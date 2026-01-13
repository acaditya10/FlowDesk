const express = require("express");
const {
  getAllUsers,
  createUser
} = require("../controllers/users.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const router = express.Router();

// public signup
router.post("/users", createUser);

// admin only
router.get(
  "/users",
  authenticate,
  authorize(["ADMIN"]),
  getAllUsers
);

module.exports = router;
