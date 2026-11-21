// Fitur owner/owner-listgc — kode inti di engine/lumen
module.exports = require('../../lib/engine/lumen').plugin("owner/owner-listgc", {
  "command": [
    "listgrup"
  ],
  "category": "owner",
  "owner": true,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur list"
})
