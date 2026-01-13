const pool = require("../config/db");

exports.getTicketActivity = async (req, res, next) => {
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
        message: "Not authorized to view activity"
      });
    }

    const [activity] = await pool.query(
      `
      SELECT
        a.action,
        a.metadata,
        a.created_at,
        u.name AS performed_by
      FROM ticket_activity a
      JOIN users u ON u.id = a.user_id
      WHERE a.ticket_id = ?
      ORDER BY a.created_at ASC
      `,
      [ticketId]
    );

    res.json(activity);
  } catch (err) {
    next(err);
  }
};
