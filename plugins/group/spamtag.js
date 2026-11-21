// Fitur group/spamtag — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("group/spamtag", {
  "name": "spamtag",
  "command": [
    "spamtag",
    "spammention"
  ],
  "category": "group",
  "desc": "Spam tag ke user tertentu (gunakan | untuk jumlah khusus)",
  "usage": ".spamtag @user (atau .spamtag @user | jumlah) (atau .spamtag @user teks)",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
