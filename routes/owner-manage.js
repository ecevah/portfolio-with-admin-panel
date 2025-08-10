"use strict";

var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var config = require("../config/adminModels");
var multer = require("multer");
var path = require("path");
var fs = require("fs");
var Project = require("../models/Project");

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.redirect("/hosgeldin/sahip/login");
}

function getModelMeta(slug) {
  return config[slug];
}

function getModulesNav() {
  return Object.keys(config).map(function (slug) {
    var meta = config[slug];
    return { slug: slug, name: meta.label || meta.modelName };
  });
}

// uploads to public/uploads/<slug>/YYYY/MM
function buildStorage(slug) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      var now = new Date();
      var dir = path.join(
        "public",
        "uploads",
        slug,
        String(now.getFullYear()),
        String(now.getMonth() + 1).padStart(2, "0")
      );
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      var ext = path.extname(file.originalname) || ".bin";
      var base = path
        .basename(file.originalname, ext)
        .replace(/[^a-z0-9-_]/gi, "_");
      var stamp = Date.now();
      cb(null, base + "_" + stamp + ext);
    },
  });
}

function getUploadMiddleware(slug, meta) {
  var fileFields = (meta.fields || [])
    .filter(function (f) {
      return f.type === "file";
    })
    .map(function (f) {
      return { name: f.name, maxCount: 1 };
    });
  // No file fields → still need to parse multipart text bodies
  if (fileFields.length === 0) {
    var parseOnly = multer();
    return parseOnly.none();
  }
  var upload = multer({ storage: buildStorage(slug) });
  return upload.fields(fileFields);
}

router.get("/:slug", requireAuth, async function (req, res) {
  var meta = getModelMeta(req.params.slug);
  if (!meta) return res.status(404).send("Modül bulunamadı");
  var items = await meta.model.find({}).limit(500).exec();
  res.render("owner/manage/list", {
    title: (meta.label || meta.modelName) + " Yönetimi",
    slug: req.params.slug,
    meta: meta,
    items: items,
    modules: getModulesNav(),
  });
});

router.get("/:slug/new", requireAuth, async function (req, res) {
  var meta = getModelMeta(req.params.slug);
  if (!meta) return res.status(404).send("Modül bulunamadı");
  var refOptions = {};
  try {
    if (meta.modelName === "ProjectDetail") {
      var projects = await Project.find({}).select("name").exec();
      refOptions.projectId = projects.map(function (p) {
        return { value: String(p._id), label: p.name };
      });
    }
  } catch (_) {}
  res.render("owner/manage/form", {
    title: (meta.label || meta.modelName) + " Ekle",
    slug: req.params.slug,
    meta: meta,
    item: {},
    modules: getModulesNav(),
    refOptions: refOptions,
  });
});

router.post("/:slug/new", requireAuth, function (req, res, next) {
  var meta = getModelMeta(req.params.slug);
  if (!meta) return res.status(404).send("Modül bulunamadı");
  return getUploadMiddleware(req.params.slug, meta)(
    req,
    res,
    async function (err) {
      if (err)
        return res
          .status(400)
          .send("Yükleme hatası: " + (err && err.message ? err.message : err));
      try {
        var data = Object.assign({}, req.body);
        // Map file fields to relative public path
        (meta.fields || []).forEach(function (f) {
          if (
            f.type === "file" &&
            req.files &&
            req.files[f.name] &&
            req.files[f.name][0]
          ) {
            var filePath = req.files[f.name][0].path.replace(
              /^public[\\\/]/,
              "/"
            );
            data[f.name] = filePath.replace(/\\/g, "/");
          }
        });
        // Validate required non-file fields (respect onlyCreate/onlyEdit)
        var missing = (meta.fields || []).filter(function (f) {
          if (!f.required) return false;
          if (f.type === "file") return false;
          if (f.onlyEdit) return false; // creating: ignore edit-only fields
          return !data[f.name];
        });
        if (missing.length) {
          return res.status(400).render("owner/manage/form", {
            title: (meta.label || meta.modelName) + " Ekle",
            slug: req.params.slug,
            meta: meta,
            item: data,
            modules: getModulesNav(),
            error:
              "Zorunlu alan(lar) eksik: " +
              missing
                .map(function (m) {
                  return m.label || m.name;
                })
                .join(", "),
          });
        }
        if (meta.modelName === "User" && data.password) {
          var salt = bcrypt.genSaltSync(10);
          data.password = bcrypt.hashSync(String(data.password), salt);
        }
        await meta.model.create(data);
        return res.redirect("/hosgeldin/sahip/manage/" + req.params.slug);
      } catch (e) {
        return res.status(400).render("owner/manage/form", {
          title: (meta.label || meta.modelName) + " Ekle",
          slug: req.params.slug,
          meta: meta,
          item: req.body,
          modules: getModulesNav(),
          error: "Kaydedilemedi: " + (e && e.message ? e.message : e),
        });
      }
    }
  );
});

router.get("/:slug/:id/edit", requireAuth, async function (req, res) {
  var meta = getModelMeta(req.params.slug);
  if (!meta) return res.status(404).send("Modül bulunamadı");
  var item = await meta.model.findById(req.params.id).exec();
  if (!item) return res.status(404).send("Kayıt bulunamadı");
  var refOptions = {};
  try {
    if (meta.modelName === "ProjectDetail") {
      var projects = await Project.find({}).select("name").exec();
      refOptions.projectId = projects.map(function (p) {
        return { value: String(p._id), label: p.name };
      });
    }
  } catch (_) {}
  res.render("owner/manage/form", {
    title: (meta.label || meta.modelName) + " Düzenle",
    slug: req.params.slug,
    meta: meta,
    item: item,
    modules: getModulesNav(),
    refOptions: refOptions,
  });
});

router.post("/:slug/:id/edit", requireAuth, function (req, res, next) {
  var meta = getModelMeta(req.params.slug);
  if (!meta) return res.status(404).send("Modül bulunamadı");
  return getUploadMiddleware(req.params.slug, meta)(
    req,
    res,
    async function (err) {
      if (err)
        return res
          .status(400)
          .send("Yükleme hatası: " + (err && err.message ? err.message : err));
      var updates = Object.assign({}, req.body);
      // file fields
      (meta.fields || []).forEach(function (f) {
        if (
          f.type === "file" &&
          req.files &&
          req.files[f.name] &&
          req.files[f.name][0]
        ) {
          var filePath = req.files[f.name][0].path.replace(
            /^public[\\\/]/,
            "/"
          );
          updates[f.name] = filePath.replace(/\\/g, "/");
        }
      });
      if (meta.modelName === "User") {
        // On edit, an edit-only password field may be defined; normalize to 'password'
        if (!updates.password && updates["password"]) {
          updates.password = updates["password"]; // no-op, same key
        }
        if (!updates.password) {
          delete updates.password; // şifre değişmiyorsa dokunma
        } else {
          var salt = bcrypt.genSaltSync(10);
          updates.password = bcrypt.hashSync(String(updates.password), salt);
        }
      }
      try {
        await meta.model
          .findByIdAndUpdate(req.params.id, updates, { runValidators: true })
          .exec();
        return res.redirect("/hosgeldin/sahip/manage/" + req.params.slug);
      } catch (e) {
        updates._id = req.params.id;
        return res.status(400).render("owner/manage/form", {
          title: (meta.label || meta.modelName) + " Düzenle",
          slug: req.params.slug,
          meta: meta,
          item: updates,
          modules: getModulesNav(),
          error: "Güncellenemedi: " + (e && e.message ? e.message : e),
        });
      }
    }
  );
});

router.post("/:slug/:id/delete", requireAuth, async function (req, res) {
  var meta = getModelMeta(req.params.slug);
  if (!meta) return res.status(404).send("Modül bulunamadı");
  try {
    await meta.model.findByIdAndDelete(req.params.id).exec();
    res.redirect("/hosgeldin/sahip/manage/" + req.params.slug);
  } catch (e) {
    res.status(400).send("Silinemedi: " + (e && e.message ? e.message : e));
  }
});

module.exports = router;
