// Fitur anime/shinigamidetail — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("anime/shinigamidetail", {
  "name": "shinigamidetail",
  "command": [
    "shinigamidetail",
    "shngm",
    "detailmanga",
    "komikshinigami",
    "shinigami"
  ],
  "category": "anime",
  "desc": "Melihat detail manga dan daftar 24 chapter terbaru dari Shinigami",
  "usage": ".shinigamidetail <url/manga_id>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
