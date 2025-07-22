const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const profileRoutes = require("./routes/profile");
dotenv.config();
connectDB(); // DB connect

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON body

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/users", profileRoutes); 
app.use("/uploads", express.static("uploads"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});




