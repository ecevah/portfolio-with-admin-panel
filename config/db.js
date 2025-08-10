"use strict";

var mongoose = require("mongoose");

function buildMongoUriFromEnv() {
  if (
    process.env.MONGODB_URI &&
    String(process.env.MONGODB_URI).trim() !== ""
  ) {
    return process.env.MONGODB_URI;
  }

  var user = encodeURIComponent(process.env.MONGODB_USER || "");
  var pass = encodeURIComponent(process.env.MONGODB_PASS || "");
  var host = process.env.MONGODB_HOST || "";
  var dbName = process.env.MONGODB_DB || "";

  var pathPart = dbName ? "/" + dbName : "/";
  return (
    "mongodb+srv://" +
    user +
    ":" +
    pass +
    "@" +
    host +
    pathPart +
    "?retryWrites=true&w=majority&appName=Cluster0"
  );
}

var hasConnectedOnce = false;

function logDatabaseSummary() {
  try {
    var nativeDb = mongoose.connection && mongoose.connection.db;
    if (!nativeDb) {
      console.warn("[MongoDB] Bağlantı özeti için db nesnesi bulunamadı");
      return;
    }
    var dbName = nativeDb.databaseName || "(bilinmiyor)";
    console.log("MongoDB'ye bağlandı • Veritabanı: " + dbName);
  } catch (e) {
    console.warn(
      "[MongoDB] Özet loglanırken hata:",
      e && e.message ? e.message : e
    );
  }
}

function connectToDatabase() {
  if (hasConnectedOnce) {
    return mongoose.connection;
  }

  var uri = buildMongoUriFromEnv();

  mongoose.set("strictQuery", true);

  mongoose
    .connect(uri)
    .then(function () {
      hasConnectedOnce = true;
      logDatabaseSummary();
    })
    .catch(function (err) {
      console.error(
        "[MongoDB] Bağlantı hatası:",
        err && err.message ? err.message : err
      );
    });

  return mongoose.connection;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  mongoose: mongoose,
};
