// Fitur owner/github — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/github", {
  "name": "github",
  "command": [
    "github",
    "gh",
    "git",
    "ghctl"
  ],
  "category": "owner",
  "desc": "Kontrol GitHub langsung dari WhatsApp (repo, file, commit, branch, issue)",
  "usage": ".gh <subperintah>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
