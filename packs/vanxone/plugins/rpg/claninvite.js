// Fitur clan/claninvite — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("clan/claninvite", {
  "name": "claninvite",
  "command": [
    "claninvite",
    "inviteclan"
  ],
  "category": "rpg",
  "desc": "Invite & langsung tambahkan user ke clan",
  "usage": ".claninvite @user",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
