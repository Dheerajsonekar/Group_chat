const express = require("express");
const app = express();
require("dotenv").config();
const db = require("./config/database");
const user = require("./models/User");
const Message = require("./models/Message");
const Group = require("./models/Group");
const GroupMember = require("./models/GroupMember");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signUp.html"));
});
app.use("/api", userRoutes);
app.use("/api", messageRoutes);

db.sync(
    { alter: true }
)
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("listen on port 3000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
