const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(express.json());

let users = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
  return res.status(400).json({
    message: "All fields are required"
  });
}

const existingUser = users.find(
  (u) => u.email === email
);

if (existingUser) {
  return res.status(400).json({
    message: "Email already exists"
  });
}

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
  email,
  password: hashedPassword,
  role: email === "admin@gmail.com"
        ? "admin"
        : "user"
});

  res.json({ message: "User registered successfully" });
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(400).json({
      message: "User not found"
    });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({
      message: "Invalid password"
    });
  }

const token = jwt.sign(
{
email: user.email,
role: user.role
},
"mysecretkey",
{
expiresIn: "1h"
}
);

res.json({
message: "Login successful",
token: token,
role: user.role
});
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.get("/users", (req, res) => {
  res.sendFile(path.join(__dirname, "users.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});