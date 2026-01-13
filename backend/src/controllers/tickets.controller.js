const pool = require("../config/db");
const logActivity = require("../utils/activityLogger");


/**
 * Create a new ticket
 * Any authenticated user can create a ticket
 */
exports.createTicket = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "title and description are required"
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO tickets (title, description, priority, created_by)
      VALUES (?, ?, ?, ?)
      `,
      [
        title,
        description,
        priority || "MEDIUM",
        req.user.id
      ]
    );
    
    await logActivity(
      result.insertId,
      req.user.id,
      "TICKET_CREATED"
    );

    res.status(201).json({
      ticket_id: result.insertId,
      status: "OPEN"
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch tickets
 * - ADMIN → sees all tickets
 * - USER → sees only their own tickets
 */
exports.getTickets = async (req, res, next) => {
  try {
    let query;
    let params = [];

    if (req.user.role === "ADMIN") {
      query = `
        SELECT 
          t.id,
          t.title,
          t.description,
          t.status,
          t.priority,
          t.created_at,
          u.email AS created_by_email
        FROM tickets t
        JOIN users u ON u.id = t.created_by
        ORDER BY t.created_at DESC
      `;
    } else {
      query = `
        SELECT 
          id,
          title,
          description,
          status,
          priority,
          created_at
        FROM tickets
        WHERE created_by = ?
        ORDER BY created_at DESC
      `;
      params.push(req.user.id);
    }

    const [tickets] = await pool.query(query, params);
    res.json(tickets);
  } catch (err) {
    next(err);
  }
};

/**
 * Assign ticket to an agent (ADMIN only)
 */
exports.assignTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        message: "assignedTo user id is required"
      });
    }

    await pool.query(
      `
      UPDATE tickets
      SET assigned_to = ?, status = 'IN_PROGRESS'
      WHERE id = ?
      `,
      [assignedTo, ticketId]
    );
    await logActivity(
      ticketId,
      req.user.id,
      "TICKET_ASSIGNED"
    );

    res.json({
      message: "Ticket assigned successfully"
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update ticket status
 * ADMIN or assigned agent only
 */
exports.updateTicketStatus = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "OPEN",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value"
      });
    }

    const [[ticket]] = await pool.query(
      `
      SELECT status, assigned_to
      FROM tickets
      WHERE id = ?
      `,
      [ticketId]
    );

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    // Authorization check
    if (
      req.user.role !== "ADMIN" &&
      ticket.assigned_to !== req.user.id
    ) {
      return res.status(403).json({
        message: "Not authorized to update this ticket"
      });
    }

    // Enforce lifecycle order
    const validTransitions = {
      OPEN: ["IN_PROGRESS"],
      IN_PROGRESS: ["RESOLVED"],
      RESOLVED: ["CLOSED"],
      CLOSED: []
    };

    if (!validTransitions[ticket.status].includes(status)) {
      return res.status(400).json({
        message: `Invalid status transition from ${ticket.status} to ${status}`
      });
    }

    await pool.query(
      `
      UPDATE tickets
      SET status = ?
      WHERE id = ?
      `,
      [status, ticketId]
    );
await logActivity(
  ticketId,
  req.user.id,
  "STATUS_UPDATED",
  {
    from: ticket.status,
    to: status
  }
);

    res.json({
      message: "Ticket status updated successfully",
      new_status: status
    });
  } catch (err) {
    next(err);
  }
};
