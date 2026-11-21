// Fitur game/mlbb — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("game/mlbb", {
  "name": "mlbb",
  "command": [
    "mlbb",
    "mlbbcounter",
    "mlsynergy",
    "mltier",
    "mlmatchup"
  ],
  "category": "game",
  "desc": "Informasi MLBB: Rekomendasi Counter, Sinergi Hero, Prediksi Matchup, & Tier List",
  "usage": ".mlbb <sub-command> <args>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
