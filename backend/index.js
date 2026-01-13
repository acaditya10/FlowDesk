require("dotenv").config();
const app = require("./src/app");
const pool = require("./src/config/db");

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL (cloud)");
    connection.release();
  } catch (err) {
    console.error("MySQL connection error:", err.message);
  }
})();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
