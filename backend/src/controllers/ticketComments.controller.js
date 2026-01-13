const pool = require("../config/db");
const logActivity = require("../utils/activityLogger");

// add comment to ticket
exports.addComment = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty"
      });
    }

    // check ticket access
    const [[ticket]] = await pool.query(
      `
      SELECT created_by, assigned_to
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

    const canAccess =
      req.user.role === "ADMIN" ||
      ticket.created_by === userId ||
      ticket.assigned_to === userId;

    if (!canAccess) {
      return res.status(403).json({
        message: "Not authorized to comment on this ticket"
      });
    }

    await pool.query(
      `
      INSERT INTO ticket_comments (ticket_id, user_id, comment)
      VALUES (?, ?, ?)
      `,
      [ticketId, userId, comment]
    );
    await logActivity(
      ticketId,
      userId,
      "COMMENT_ADDED"
    );

    res.status(201).json({
      message: "Comment added successfully"
    });
  } catch (err) {
    next(err);
  }
};

// get comments for a ticket
exports.getComments = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const userId = req.user.id;

    const [[ticket]] = await pool.query(
      `
      SELECT created_by, assigned_to
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

    const canAccess =
      req.user.role === "ADMIN" ||
      ticket.created_by === userId ||
      ticket.assigned_to === userId;

    if (!canAccess) {
      return res.status(403).json({
        message: "Not authorized to view comments"
      });
    }

    const [comments] = await pool.query(
      `
      SELECT
        c.id,
        c.comment,
        c.created_at,
        u.name AS author
      FROM ticket_comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.ticket_id = ?
      ORDER BY c.created_at ASC
      `,
      [ticketId]
    );

    res.json(comments);
  } catch (err) {
    next(err);
  }
};
