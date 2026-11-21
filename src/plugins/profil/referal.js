// Fitur user/referal — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("user/referal", {
  "name": "referal",
  "command": [
    "referal",
    "referral",
    "refer",
    "ref"
  ],
  "category": "profil",
  "desc": "Sistem kode referral untuk mendapatkan EXP",
  "usage": ".referal [kode]",
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
