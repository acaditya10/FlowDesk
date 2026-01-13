exports.healthCheck = (req, res) => {
  res.json({
    status: "OK",
    message: "FlowDesk server running"
  });
};
