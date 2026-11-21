// Fitur ai/epsilon — kode inti di engine/pulse
module.exports = require('../../lib/engine/pulse').plugin("ai/epsilon", {
  "name": "epsilon",
  "command": [
    "epsilon",
    "epsilonai"
  ],
  "category": "ai",
  "desc": "Fitur epsilon <topik>",
  "usage": ".epsilon <topik>",
  "limit": true
})
