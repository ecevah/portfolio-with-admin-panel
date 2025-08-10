var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var dotenv = require("dotenv");
dotenv.config();
var db = require("./config/db");
db.connectToDatabase();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Load site config and expose to views
var siteConfig = require("./config/siteConfig");
app.locals.siteConfig = siteConfig;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// sessions
var session = require("express-session");
var MongoStore = require("connect-mongo");
app.use(
  session({
    secret: process.env.SESSION_SECRET || "nehir-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 8 },
  })
);

// routes
app.use("/", require("./routes/index"));
app.use("/api", require("./routes/api"));
app.use("/hosgeldin/sahip", require("./routes/owner"));
app.use("/hosgeldin/sahip/manage", require("./routes/owner-manage"));

// 404 -> home redirect
app.use(function (req, res) {
  return res.redirect("/");
});

// error handler: fallback to home
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  try {
    return res.redirect("/");
  } catch (_) {
    return res.end();
  }
});

module.exports = app;
