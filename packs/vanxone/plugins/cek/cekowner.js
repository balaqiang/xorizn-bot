// Fitur cek/cekowner — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekowner", {
  "name": "cekowner",
  "command": [
    "cekowner",
    "ownerinfo"
  ],
  "category": "cek",
  "desc": "Cek apakah user adalah owner bot",
  "usage": ".cekowner @user",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
