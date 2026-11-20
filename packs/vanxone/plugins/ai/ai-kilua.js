// Fitur ai/ai-kilua — kode inti di engine/vortex
module.exports = require('../../lib/engine/vortex').plugin("ai/ai-kilua", {
  "name": "kilua",
  "command": [
    "kilua"
  ],
  "category": "ai",
  "desc": "Perintah kilua",
  "usage": "kilua <teks>",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
})
