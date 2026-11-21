// Fitur search/pin2 — kode inti di engine/vortex
module.exports = require('../../lib/engine/vortex').plugin("search/pin2", {
  "name": "pindlrich",
  "command": [
    "pindlrich"
  ],
  "category": "search",
  "desc": "Perintah pindlrich <search> <jumlah>",
  "usage": "pindlrich",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
})
