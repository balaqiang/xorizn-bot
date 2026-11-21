// lib/sahril/hd.js — pengganti lib/scrape/hd_upscale.js bot asal (iLoveIMG + Remini; berkas aslinya tidak ada di zip).
// Memakai upscale lokal vanXone (sharp: lanczos3 + penajaman). API sama: hdr(buffer, scale) & reminiHDFallback(buffer).
'use strict'
const imgops = require('../../imgops')

async function hdr(buffer, scale = 2) {
  const r = await imgops.upscale(Buffer.from(buffer), Math.max(1, Math.min(4, Number(scale) || 2)))
  return r.buffer
}

async function reminiHDFallback(buffer) {
  return hdr(buffer, 2)
}

module.exports = { hdr, reminiHDFallback }
