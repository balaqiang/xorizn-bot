// Fitur canvas/fakedev7 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakedev7", {
  "name": "fakedev7",
  "command": [
    "fakedev7"
  ],
  "category": "image",
  "desc": "Membuat fake developer (Python Theme)",
  "usage": ".fakedev7 <nama> (reply/kirim foto)",
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
