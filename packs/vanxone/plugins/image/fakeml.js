// Fitur canvas/fakeml — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakeml", {
  "name": "fakeml",
  "command": [
    "fakeml",
    "mlbbfake",
    "mlcard",
    "mlfake"
  ],
  "category": "image",
  "desc": "Membuat fake ML profile card",
  "usage": ".fakeml <nama> (reply/kirim foto)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
