// Fitur canvas/fakeovo — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakeovo", {
  "name": "fakeovo",
  "command": [
    "fakeovo",
    "fake-ovo"
  ],
  "category": "image",
  "desc": "Membuat canvas fake ovo",
  "usage": ".fake-ovo <nama>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
