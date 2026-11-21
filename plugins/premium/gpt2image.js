// Fitur premium/gpt2image — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("premium/gpt2image", {
  "name": "gpt2image",
  "command": [
    "gpt2image",
    "gptimg2img",
    "image2image"
  ],
  "category": "Premium",
  "desc": "Image-to-image memakai GPT2Image",
  "usage": ".gpt2image <prompt> (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "cooldown": 60,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
