// Fitur ai/o-txt2img — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/txt2img", {
  "name": "text2img3",
  "command": [
    "text2img3"
  ],
  "category": "ai",
  "desc": "Generate gambar dari teks dengan AI",
  "usage": ".txt2img <prompt> | <style>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 30,
  "energi": 1,
  "needs": {
    "apikeys": [
      "neoxr"
    ],
    "scrapers": [],
    "assets": []
  }
})
