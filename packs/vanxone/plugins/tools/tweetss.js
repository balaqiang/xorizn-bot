// Fitur tools/tweetss — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/tweetss", {
  "name": "tweetss",
  "command": [
    "tweetss",
    "orshot",
    "tweetimage",
    "tweetimg"
  ],
  "category": "tools",
  "desc": "Membuat gambar screenshot aesthetic dari link postingan X (Twitter)",
  "usage": ".tweetss <url tweet>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
