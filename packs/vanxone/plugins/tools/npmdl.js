// Fitur tools/npmdl — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/npmdl", {
  "name": "npmdl",
  "command": [
    "npmdl",
    "npmdownload"
  ],
  "category": "tools",
  "desc": "Download package NPM dalam format tarball .tgz",
  "usage": ".npmdl <package atau URL NPM>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
