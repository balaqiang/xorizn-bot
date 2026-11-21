// Fitur maker/reminder — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("maker/reminder", {
  "name": "reminder",
  "command": [
    "reminder"
  ],
  "category": "image",
  "desc": "Fitur reminder",
  "usage": ".reminder",
  "limit": true
})
