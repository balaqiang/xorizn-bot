// Fitur fun/haruskah — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("fun/haruskah", {
  "name": "haruskah",
  "command": [
    "haruskah",
    "harus",
    "should"
  ],
  "category": "fun",
  "desc": "Tanya bot haruskah sesuatu",
  "usage": ".haruskah <pertanyaan>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
