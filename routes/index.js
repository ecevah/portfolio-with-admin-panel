"use strict";

var express = require("express");
var router = express.Router();

// Models
var Homepage = require("../models/Homepage");
var Link = require("../models/Link");
var Quote = require("../models/Quote");
var Project = require("../models/Project");
var ProjectDetail = require("../models/ProjectDetail");
var About = require("../models/About");
var AboutDetail = require("../models/AboutDetail");
var Summary = require("../models/Summary");
var AboutPhoto = require("../models/AboutPhoto");

// Home (Portfolio landing)
router.get("/", async function (req, res) {
  try {
    var homepage = await Homepage.findOne({}).sort({ createdAt: -1 }).exec();
    var links = await Link.find({}).sort({ createdAt: -1 }).exec();
    var quotes = await Quote.find({}).sort({ createdAt: -1 }).limit(3).exec();
    var projects = await Project.find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .exec();

    return res.render("site/home", {
      title: "Portfolio",
      homepage: homepage || null,
      links: links || [],
      quotes: quotes || [],
      projects: projects || [],
    });
  } catch (e) {
    return res.status(500).render("error", { message: "Anasayfa yüklenemedi" });
  }
});

// About
router.get("/about", async function (req, res) {
  try {
    var about = await About.findOne({}).sort({ createdAt: -1 }).exec();
    var photos = await AboutPhoto.find({})
      .sort({ order: 1, createdAt: 1 })
      .exec();
    var details = await AboutDetail.find({})
      .sort({ order: 1, createdAt: 1 })
      .exec();
    var summaries = await Summary.find({})
      .sort({ year: -1, createdAt: -1 })
      .exec();
    var links = await Link.find({}).sort({ createdAt: -1 }).exec();

    return res.render("site/about", {
      title: about ? about.header : "Hakkımda",
      about: about || null,
      photos: photos || [],
      details: details || [],
      summaries: summaries || [],
      links: links || [],
    });
  } catch (e) {
    return res
      .status(500)
      .render("error", { message: "Hakkımda sayfası yüklenemedi" });
  }
});

// Blog (placeholder)
router.get("/blog", async function (req, res) {
  try {
    var links = await Link.find({}).sort({ createdAt: -1 }).exec();
    return res.render("site/blog", {
      title: "Blog",
      links: links || [],
      posts: [],
    });
  } catch (e) {
    return res.status(500).render("error", { message: "Blog yüklenemedi" });
  }
});

// Projects list
router.get("/projects", async function (req, res) {
  try {
    var projects = await Project.find({}).sort({ createdAt: -1 }).exec();
    var links = await Link.find({}).sort({ createdAt: -1 }).exec();
    return res.render("site/projects", {
      title: "Projeler",
      projects: projects || [],
      links: links || [],
    });
  } catch (e) {
    return res.status(500).render("error", { message: "Projeler yüklenemedi" });
  }
});

// Project detail
router.get("/projects/:id", async function (req, res) {
  try {
    var project = await Project.findById(req.params.id).exec();
    if (!project)
      return res.status(404).render("error", { message: "Proje bulunamadı" });
    var details = await ProjectDetail.find({ projectId: project._id })
      .sort({ order: 1, createdAt: 1 })
      .exec();
    var links = await Link.find({}).sort({ createdAt: -1 }).exec();
    return res.render("site/project", {
      title: project.name,
      project: project,
      details: details || [],
      links: links || [],
    });
  } catch (e) {
    return res
      .status(500)
      .render("error", { message: "Proje sayfası yüklenemedi" });
  }
});

module.exports = router;
