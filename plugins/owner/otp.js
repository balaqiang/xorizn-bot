// Fitur owner/otp — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/otp", {
  "name": "rimuru-otp",
  "command": [
    "rimuru-otp",
    "otpmenu",
    "otplayanan",
    "otpprofile",
    "otporder",
    "otpgetorder",
    "otpsms",
    "otpcancel",
    "otpcancelsms"
  ],
  "category": "owner",
  "desc": "Layanan OTP Rimuru dengan API dan key yang dipindahkan ke config Rimuru",
  "usage": ".otpmenu / .otplayanan / .otporder <id> / .otpgetorder <id> / .otpsms <id> / .otpcancel <id>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 2,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
