// Fitur _system/checkerror — kode inti di engine/vortex
module.exports = require('../../lib/engine/vortex').plugin("_system/checkerror", {
  "name": "checkerror",
  "command": [
    "checkerror"
  ],
  "category": "owner",
  "desc": "Perintah checkerror",
  "usage": "checkerror",
  "owner": true,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
})
