const express = require("express");
const session = require("express-session");

const app = express();


app.use(express.json());

// Session Middleware
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60
    }
  })
);


const USER = {
  username: "admin",
  password: "1234"
};

// Authentication Middleware
function authMiddleware(req, res, next) {

  if (req.session.user) {
    next();
  } else {
    res.status(401).send("Access Denied. Please Login First");
  }

}

// Login Route
app.post("/login", (req, res) => {

  const { username, password } = req.body;

  if (
    username === USER.username &&
    password === USER.password
  ) {

    req.session.user = username;

    res.send("Login Successful");

  } else {

    res.send("Invalid Credentials");

  }

});

// Protected Dashboard Route
app.get("/dashboard", authMiddleware, (req, res) => {

  res.send(`Welcome ${req.session.user} to Dashboard`);

});

// Logout Route
app.get("/logout", (req, res) => {

  req.session.destroy((err) => {

    if (err) {
      return res.send("Error while logging out");
    }

    res.clearCookie("connect.sid");

    res.send("Logged out successfully");

  });

});

// Start Server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});