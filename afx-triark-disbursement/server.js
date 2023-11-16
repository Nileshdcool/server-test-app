const express = require("express");
const app = express();
const http = require("http").Server(app);
const path = require("path");
const PORT = process.env.PORT || 5002;
app.use("/", express.static(path.join(__dirname, "/build")));
app.use("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/build/index.html`));
});
http.listen(PORT, () => {});
