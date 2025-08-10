"use strict";

var path = require("path");

module.exports = {
  user: {
    modelName: "User",
    label: "Kullanıcılar",
    model: require(path.join("..", "models", "User")),
    fields: [
      {
        name: "username",
        label: "Kullanıcı Adı",
        type: "text",
        required: true,
      },
      { name: "nameSurname", label: "Ad Soyad", type: "text", required: true },
      {
        name: "password",
        label: "Şifre",
        type: "password",
        required: true,
        onlyCreate: true,
      },
      {
        name: "password",
        label: "Yeni Şifre (opsiyonel)",
        type: "password",
        required: false,
        onlyEdit: true,
      },
    ],
  },
  homepage: {
    modelName: "Homepage",
    label: "Anasayfa",
    model: require(path.join("..", "models", "Homepage")),
    fields: [
      {
        name: "image",
        label: "Kapak Görseli",
        type: "file",
        required: true,
      },
      {
        name: "aboutText",
        label: "Hakkımda Yazısı",
        type: "textarea",
        required: true,
      },
      {
        name: "aboutImage",
        label: "Hakkımda Görseli",
        type: "file",
        required: true,
      },
    ],
  },
  link: {
    modelName: "Link",
    label: "Bağlantılar",
    model: require(path.join("..", "models", "Link")),
    fields: [
      { name: "url", label: "Bağlantı", type: "url", required: true },
      { name: "logo", label: "Logo", type: "file", required: true },
    ],
  },
  quote: {
    modelName: "Quote",
    label: "Özlü Sözler",
    model: require(path.join("..", "models", "Quote")),
    fields: [
      { name: "text", label: "Özlü Söz", type: "textarea", required: true },
    ],
  },
  project: {
    modelName: "Project",
    label: "Projeler",
    model: require(path.join("..", "models", "Project")),
    fields: [
      { name: "photo", label: "Fotoğraf", type: "file", required: true },
      { name: "name", label: "Proje Adı", type: "text", required: true },
    ],
  },
  projectdetail: {
    modelName: "ProjectDetail",
    label: "Proje Detayları",
    model: require(path.join("..", "models", "ProjectDetail")),
    fields: [
      {
        name: "projectId",
        label: "Proje",
        type: "ref",
        ref: "Project",
        required: true,
      },
      { name: "order", label: "Sıra", type: "number", required: true },
      {
        name: "type",
        label: "Tür",
        type: "enum",
        enum: ["Text", "Double Text", "Image", "Double Image"],
        required: true,
      },
      { name: "photo", label: "Fotoğraf", type: "file" },
      { name: "content", label: "İçerik", type: "textarea" },
      { name: "secondPhoto", label: "İkinci Fotoğraf", type: "file" },
    ],
  },
  about: {
    modelName: "About",
    label: "Hakkımda",
    model: require(path.join("..", "models", "About")),
    fields: [
      { name: "title", label: "Başlık", type: "text", required: true },
      { name: "header", label: "Üst Başlık", type: "text", required: true },
    ],
  },
  aboutdetail: {
    modelName: "AboutDetail",
    label: "Hakkımda Detayları",
    model: require(path.join("..", "models", "AboutDetail")),
    fields: [
      { name: "order", label: "Sıra", type: "number", required: true },
      { name: "content", label: "İçerik", type: "textarea", required: true },
    ],
  },
  summary: {
    modelName: "Summary",
    label: "Özetler",
    model: require(path.join("..", "models", "Summary")),
    fields: [
      { name: "year", label: "Yıl", type: "number", required: true },
      { name: "who", label: "Kim", type: "text", required: true },
      { name: "content", label: "İçerik", type: "textarea", required: true },
    ],
  },
  aboutphoto: {
    modelName: "AboutPhoto",
    label: "Hakkımda Fotoğrafları",
    model: require(path.join("..", "models", "AboutPhoto")),
    fields: [
      { name: "order", label: "Sıra", type: "number", required: true },
      { name: "url", label: "Fotoğraf", type: "file", required: true },
    ],
  },
};
