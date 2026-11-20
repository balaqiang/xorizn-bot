// Fitur maker/fakeigstory — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/fakeigstory", {
  "name": "fakeigstory",
  "command": [
    "fakeigstory",
    "igstoryfake",
    "fakeigs"
  ],
  "category": "maker",
  "desc": "Membuat fake Instagram Story",
  "usage": ".fakeigstory <username>|<caption>|<time>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
