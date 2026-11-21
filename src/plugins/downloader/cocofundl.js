// Fitur download/cocofundl — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("download/cocofundl", {
  "name": "cocofundl",
  "command": [
    "cocofundl",
    "cfdl",
    "cocofun"
  ],
  "category": "downloader",
  "desc": "Download video CocoFun",
  "usage": ".cfdl <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
