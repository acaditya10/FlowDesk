const pool = require("../config/db");

const logActivity = async (
  ticketId,
  userId,
  action,
  metadata = null
) => {
  await pool.query(
    `
    INSERT INTO ticket_activity (ticket_id, user_id, action, metadata)
    VALUES (?, ?, ?, ?)
    `,
    [
      ticketId,
      userId,
      action,
      metadata ? JSON.stringify(metadata) : null
    ]
  );
};

module.exports = logActivity;
