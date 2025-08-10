"use strict";

var bcrypt = require("bcryptjs");

function isUserModel(Model) {
  return Model && Model.modelName === "User";
}

function sanitizeBodyForModel(Model, body) {
  var data = Object.assign({}, body);
  if (isUserModel(Model) && data.password) {
    var salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(String(data.password), salt);
  }
  return data;
}

function createCrudController(Model) {
  return {
    async list(req, res) {
      try {
        var page = Math.max(parseInt(req.query.page || "1", 10), 1);
        var limit = Math.min(
          Math.max(parseInt(req.query.limit || "50", 10), 1),
          200
        );
        var skip = (page - 1) * limit;
        var [items, total] = await Promise.all([
          Model.find({}).skip(skip).limit(limit).exec(),
          Model.countDocuments({}).exec(),
        ]);
        res.json({ items: items, page: page, limit: limit, total: total });
      } catch (err) {
        res
          .status(500)
          .json({ error: err && err.message ? err.message : String(err) });
      }
    },

    async get(req, res) {
      try {
        var item = await Model.findById(req.params.id).exec();
        if (!item) return res.status(404).json({ error: "Not found" });
        res.json(item);
      } catch (err) {
        res
          .status(500)
          .json({ error: err && err.message ? err.message : String(err) });
      }
    },

    async create(req, res) {
      try {
        var data = sanitizeBodyForModel(Model, req.body);
        var created = await Model.create(data);
        res.status(201).json(created);
      } catch (err) {
        res
          .status(400)
          .json({ error: err && err.message ? err.message : String(err) });
      }
    },

    async update(req, res) {
      try {
        var data = sanitizeBodyForModel(Model, req.body);
        var updated = await Model.findByIdAndUpdate(req.params.id, data, {
          new: true,
          runValidators: true,
        }).exec();
        if (!updated) return res.status(404).json({ error: "Not found" });
        res.json(updated);
      } catch (err) {
        res
          .status(400)
          .json({ error: err && err.message ? err.message : String(err) });
      }
    },

    async remove(req, res) {
      try {
        var removed = await Model.findByIdAndDelete(req.params.id).exec();
        if (!removed) return res.status(404).json({ error: "Not found" });
        res.json({ ok: true });
      } catch (err) {
        res
          .status(400)
          .json({ error: err && err.message ? err.message : String(err) });
      }
    },
  };
}

module.exports = { createCrudController: createCrudController };
