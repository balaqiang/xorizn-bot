// =====================================================================
//  lib/integrity.js — penjaga auto join: memastikan lib/autojoin.js tidak diubah
//
//  Memakai SHA-256 (line ending dinormalkan, jadi aman dari CRLF Windows/git).
//  Kalau tidak cocok -> bot berhenti dengan pesan jelas.
//
//  Catatan jujur: ini pagar, bukan brankas. JavaScript yang dibagikan terbuka tetap bisa diedit orang yang
//  mau repot menghapus pengecekan ini. Untuk perlindungan lebih kuat, obfuscate file (mis. javascript-obfuscator).
//
//  Developer: setelah mengubah lib/autojoin.js jalankan  `node lib/integrity.js --update`
// =====================================================================
'use strict'

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const TARGET = path.join(__dirname, 'autojoin.js')
const EXPECTED = '7b7b5dc579738d5b63b85146b4fa1887cdd7ffa40cf9ad308afcbf6ff8564461'

const hashOf = () => crypto.createHash('sha256').update(fs.readFileSync(TARGET, 'utf8').replace(/\r\n?/g, '\n')).digest('hex')

function check() {
  let ok = false
  try {
    ok = hashOf() === EXPECTED
  } catch {}
  if (!ok) {
    console.log('\n[LOCK] lib/autojoin.js telah diubah / hilang. Auto join Saluran & Grup resmi dikunci dan tidak boleh diubah.')
    console.log('[LOCK] Pulihkan file aslinya lalu jalankan ulang bot.\n')
    process.exit(1)
  }
  return true
}

if (require.main === module) {
  if (process.argv.includes('--update')) {
    const self = fs.readFileSync(__filename, 'utf8').replace(/const EXPECTED = '[0-9a-f_A-Z]+'/, `const EXPECTED = '${hashOf()}'`)
    fs.writeFileSync(__filename, self)
    console.log('hash autojoin diperbarui:', hashOf())
  } else console.log(hashOf() === EXPECTED ? 'autojoin utuh' : 'autojoin BERUBAH')
}

module.exports = { check, hashOf }
