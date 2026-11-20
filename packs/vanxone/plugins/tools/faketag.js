// Fitur tools/faketag — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tools/faketag", {
  "name": "faketag",
  "command": [
    "faketag",
    "ftag",
    "fake"
  ],
  "category": "tools",
  "desc": "Fake tag dengan isi pesan custom, support media/stiker",
  "usage": ".faketag @user|pesan tag|pesan\\n.faketag @user|pesan tag|image|caption\\n.faketag @user|pesan tag|#sticker\\n.faketag @user|pesan tag|#audio\\n.faketag @user|pesan tag|#voice",
  "owner": false,
  "group": true,
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
