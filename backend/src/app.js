const express = require("express");
const healthRoutes = require("./routes/health.routes");
const usersRoutes = require("./routes/users.routes");
const errorHandler = require("./middlewares/error.middleware");
const authRoutes = require("./routes/auth.routes");
const ticketsRoutes = require("./routes/tickets.routes");
const ticketCommentsRoutes = require("./routes/ticketComments.routes");
const ticketActivityRoutes = require("./routes/ticketActivity.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api", healthRoutes);
app.use("/api", usersRoutes);
app.use("/api", authRoutes);
app.use("/api", ticketsRoutes);
app.use("/api", ticketCommentsRoutes);
app.use("/api", ticketActivityRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

module.exports = app;
