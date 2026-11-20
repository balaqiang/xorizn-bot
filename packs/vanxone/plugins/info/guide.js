// Fitur main/guide — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("main/guide", {
  "name": "guide",
  "command": [
    "tutorial",
    "guide",
    "panduan"
  ],
  "category": "info",
  "desc": "Tutorial penggunaan bot",
  "usage": ".guide"
})
