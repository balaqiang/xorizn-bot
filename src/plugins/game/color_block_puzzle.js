// Fitur game/color_block_puzzle — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/color_block_puzzle", {
  "name": "colorblock",
  "command": [
    "colorblock",
    "colorblockpuzzle",
    "cbp"
  ],
  "category": "game",
  "desc": "Puzzle kotak warna - geser balok kiri/kanan, samakan warna biar hancur!",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
