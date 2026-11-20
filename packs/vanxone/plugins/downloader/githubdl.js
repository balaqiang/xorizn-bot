// Fitur download/githubdl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/githubdl", {
  "name": "githubdl",
  "command": [
    "githubdl",
    "repodownload"
  ],
  "category": "downloader",
  "desc": "Download repository GitHub sebagai ZIP",
  "usage": ".githubdl <user> <repo> <branch>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
