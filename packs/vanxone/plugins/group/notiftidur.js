// Fitur group/notiftidur — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("group/notiftidur", {
  "name": "notiftidur",
  "command": [
    "notiftidur",
    "jadwaltidur",
    "tidurreminder",
    "sleepreminder"
  ],
  "category": "group",
  "desc": "Atur pengingat waktu tidur otomatis",
  "usage": ".notiftidur on <jam1,jam2,...> / off / edit <jam1,jam2,...>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
