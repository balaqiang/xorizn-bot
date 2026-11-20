// Fitur tools/scanrepo — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/scanrepo", {
  "name": "scanrepo",
  "command": [
    "scanrepo",
    "scanrepodev"
  ],
  "category": "tools",
  "desc": "Scan repository GitHub untuk security risk",
  "usage": ".scanrepo <github-url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
