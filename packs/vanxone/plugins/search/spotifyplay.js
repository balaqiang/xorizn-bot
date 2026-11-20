// Fitur search/spotifyplay — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("search/spotifyplay", {
  "name": "spotifyplay",
  "command": [
    "spotifyplay"
  ],
  "category": "search",
  "desc": "Fitur spotifyplay <judul>",
  "usage": ".spotifyplay <judul>",
  "limit": true
})
