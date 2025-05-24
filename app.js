const express = require("express");
const app = express();
require("dotenv").config();
const db = require("./config/database");

const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const groupRoutes = require("./routes/groupRoutes");
const cors = require("cors");
const path = require("path");
const User = require("./models/User");
const Message = require("./models/Message");
const Group = require("./models/Group");
const GroupMember = require("./models/GroupMember");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signUp.html"));
});
app.use("/api", userRoutes);
app.use("/api", messageRoutes);
app.use("/api", groupRoutes);



// Associations
User.hasMany(Message, {foreignKey: 'userId'})
Message.belongsTo(User, {foreignKey: 'userId'});

Message.belongsTo(Group);
Group.hasMany(Message);

Group.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
User.hasMany(Group, { as: 'createdGroups', foreignKey: 'createdBy' });

User.belongsToMany(Group, { through: GroupMember, as: 'memberGroups', foreignKey: 'userId' });
Group.belongsToMany(User, { through: GroupMember, as: 'members', foreignKey: 'groupId' });

GroupMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });

db.sync(
    // { alter: true }
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
