"use strict";

var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var User = require("../models/User");
var adminModels = require("../config/adminModels");

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.redirect("/hosgeldin/sahip/login");
}

router.get("/", function (req, res) {
  if (req.session && req.session.userId) {
    return res.redirect("/hosgeldin/sahip/panel");
  }
  return res.redirect("/hosgeldin/sahip/login");
});

router.get("/login", function (req, res) {
  if (req.session && req.session.userId)
    return res.redirect("/hosgeldin/sahip/panel");
  res.render("owner/login", { title: "Giriş Yap", error: null });
});

router.post("/login", async function (req, res) {
  try {
    var username = String(req.body.username || "").trim();
    var password = String(req.body.password || "");
    var user = await User.findOne({ username: username }).exec();
    if (!user)
      return res.status(401).render("owner/login", {
        title: "Giriş Yap",
        error: "Kullanıcı bulunamadı",
      });
    var ok = bcrypt.compareSync(password, user.password);
    if (!ok)
      return res
        .status(401)
        .render("owner/login", { title: "Giriş Yap", error: "Şifre hatalı" });
    req.session.userId = String(user._id);
    req.session.username = user.username;
    return res.redirect("/hosgeldin/sahip/panel");
  } catch (err) {
    return res
      .status(500)
      .render("owner/login", { title: "Giriş Yap", error: "Bir hata oluştu" });
  }
});

// Register akışı kaldırıldı; login sayfasına yönlendir
router.get("/register", function (req, res) {
  return res.redirect("/hosgeldin/sahip/login");
});

router.get("/logout", function (req, res) {
  if (req.session) {
    req.session.destroy(function () {
      res.redirect("/hosgeldin/sahip/login");
    });
  } else {
    res.redirect("/hosgeldin/sahip/login");
  }
});

router.get("/panel", requireAuth, async function (req, res) {
  try {
    var slugs = Object.keys(adminModels);
    var modules = await Promise.all(
      slugs.map(async function (slug) {
        var meta = adminModels[slug];
        var count = await meta.model.countDocuments({}).exec();
        return { slug: slug, name: meta.label || meta.modelName, count: count };
      })
    );
    res.render("owner/panel", {
      title: "Admin Panel",
      username: req.session.username,
      modules: modules,
    });
  } catch (e) {
    res.render("owner/panel", {
      title: "Admin Panel",
      username: req.session.username,
      modules: [],
    });
  }
});

// Yönetim kısayolları
router.get("/manage", requireAuth, function (req, res) {
  res.redirect("/hosgeldin/sahip/manage/user");
});

module.exports = router;

module.exports = router;
