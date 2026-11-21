// Fitur ai/dolphin — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/dolphin", {
  "name": "dolphin",
  "command": [
    "dolphin",
    "dolphinai",
    "dphn"
  ],
  "category": "ai",
  "desc": "Chat dengan Dolphin AI (24B Model)",
  "usage": ".dolphin <pertanyaan> atau .dolphin --<template> <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
