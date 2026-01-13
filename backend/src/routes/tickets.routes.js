const express = require("express");
const {
  createTicket,
  getTickets,
  assignTicket,
  updateTicketStatus
} = require("../controllers/tickets.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

const router = express.Router();

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a new ticket
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *     responses:
 *       201:
 *         description: Ticket created
 */


// create ticket
router.post("/tickets", authenticate, createTicket);

// fetch tickets
router.get("/tickets", authenticate, getTickets);

// assign ticket (ADMIN only)
router.put(
  "/tickets/:ticketId/assign",
  authenticate,
  authorize(["ADMIN"]),
  assignTicket
);

// update ticket status
router.patch(
  "/tickets/:ticketId/status",
  authenticate,
  updateTicketStatus
);

module.exports = router;
