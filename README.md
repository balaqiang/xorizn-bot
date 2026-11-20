<div align="center">
<img src="assets/images/thumbnail.jpg" alt="Bitch Bot" width="220" />

# BITCH BOT v2

Bot WhatsApp multi-device berbasis **Baileys v7** dengan **dashboard web localhost**,
gabungan fitur **Rubby-MD** + **vanXone** (±2.380 perintah), dan pilihan database **JSON / SQLite / MySQL (XAMPP)**.

</div>

---

## Fitur utama

- **Baileys 7 (rc14)** — login *pairing code* atau QR, auto-reconnect, dukungan LID (`@lid`) WhatsApp terbaru.
- **Dashboard modern** di `http://127.0.0.1:3000`: status & koneksi (minta kode pairing / scan QR dari browser), daftar grup yang diikuti bot, pengaturan per grup, modul & perintah (aktif/nonaktif, pilih sumber saat nama bentrok), pengguna (premium/ban/owner), pengaturan bot, database, dan log realtime.
- **Welcome & goodbye bergambar** memakai [`discord-canvas`](https://www.npmjs.com/package/discord-canvas) — teks, warna, dan latar bisa diatur per grup, lengkap dengan pratinjau di dashboard.
- **Database pilihan**: `json` (satu file), `sqlite` (bawaan Node, tanpa instalasi), `mysql` (XAMPP/MariaDB). Data bisa dipindah antar-driver dari dashboard.
- **Fitur grup native**: anti-link (hapus/peringatan/kick), anti kata kasar, peringatan, bot on/off per grup, mode hanya-admin, NSFW per grup, auto-stiker, auto-respon, notifikasi promote/demote, hidetag/tagall, kick/add/promote/demote, buka/tutup grup, dll.
- **Semua fitur pack** tetap jalan: vanXone v1.32 (2.257 plugin dari 7 engine) dan Rubby-MD v1.5 (268 plugin).
- **Graphify** terpasang untuk memetakan kode project menjadi knowledge graph.

## Persyaratan

| | |
|---|---|
| Node.js | **22.5 atau lebih baru** (disarankan 22 LTS / 24). SQLite memakai modul bawaan `node:sqlite`. |
| FFmpeg | Sudah ikut lewat `ffmpeg-static` (Windows/Linux x64). Di Termux: `pkg install ffmpeg`. |
| MySQL | Opsional — hanya jika memilih driver `mysql` (XAMPP / MariaDB / MySQL). |
| Python + uv | Opsional — hanya untuk Graphify. |

## Instalasi

```bash
git clone https://github.com/balaqiang/bitch-bot
cd bitch-bot
npm install
npm start
```

Saat start pertama:

1. `config/config.json` dibuat otomatis dari `config/config.example.json`.
2. **Password dashboard** dibuat acak, dicetak di console, dan disimpan di `config/config.json` → `dashboard.password`.
3. Buka **http://127.0.0.1:3000**, login, lalu di kartu *Hubungkan WhatsApp* masukkan nomor bot → **Minta kode**.
4. Di HP: WhatsApp → *Perangkat tertaut* → *Tautkan perangkat* → *Tautkan dengan nomor telepon* → masukkan kode.
5. Isi **nomor owner** di *Pengaturan Bot* (tanpa ini perintah owner tidak bisa dipakai).

> Lebih suka QR? Ubah *Metode login* di **Sistem & Database** (atau `bot.loginMethod: "qr"`), lalu restart.
> Tanpa dashboard: isi `bot.pairingNumber` di `config/config.json`, kode pairing akan muncul di console.

### Termux (Android)

```bash
pkg install nodejs-lts git ffmpeg python build-essential
git clone https://github.com/balaqiang/bitch-bot && cd bitch-bot
npm install && npm start
```

Bila paket `canvas` gagal dibangun di Termux, kartu welcome otomatis memakai renderer cadangan (`@napi-rs/canvas`) dengan tata letak yang sama.

## Perintah npm

| Perintah | Fungsi |
|---|---|
| `npm start` | Jalankan bot lewat launcher (auto-restart saat crash / tombol Restart di dashboard) |
| `npm run start:raw` | Jalankan langsung tanpa launcher |
| `npm run dev` | Mode pengembangan (restart otomatis saat file `src/` atau `plugins/` berubah) |
| `npm run check` | Muat semua plugin & dashboard tanpa menyambung ke WhatsApp |
| `npm run reset-session` | Pindahkan sesi login ke cadangan untuk login ulang / ganti nomor |
| `npm run graph` | Perbarui knowledge graph Graphify |

## Database

Atur di dashboard → **Sistem & Database**, atau `config/config.json`:

```jsonc
"database": {
  "driver": "json",                                  // json | sqlite | mysql
  "json":   { "file": "data/database.json" },
  "sqlite": { "file": "data/database.sqlite" },
  "mysql":  { "host": "127.0.0.1", "port": 3306, "user": "root", "password": "", "database": "bitch_bot" }
}
```

**Memakai XAMPP:** buka XAMPP Control Panel → *Start* modul **MySQL** → di dashboard pilih *MySQL / XAMPP* → **Tes koneksi** → **Pindahkan data & pakai** → restart.
Database `bitch_bot` dan tabel `bot_store` dibuat otomatis (lihat isinya di phpMyAdmin).

Semua driver menyimpan baris `(collection, id, data JSON)` sehingga data bisa dipindah bolak-balik tanpa kehilangan isi.
Bila MySQL mati saat bot start, bot tetap jalan memakai JSON sementara dan dashboard menampilkan peringatan.

## Struktur project

```
bitch-bot/
├── config/
│   ├── config.example.json   # template konfigurasi (di-commit)
│   └── config.json           # konfigurasi lokal (TIDAK di-commit: password & API key)
├── src/
│   ├── index.js              # titik masuk: config → db → plugin → pack → dashboard → WhatsApp
│   ├── launcher.js           # menjalankan & me-restart index.js
│   ├── config.js  logger.js
│   ├── core/                 # koneksi Baileys, serializer, handler, registri perintah, cache, model data
│   ├── database/             # Database + driver json / sqlite / mysql
│   ├── features/             # welcome (discord-canvas), moderasi, AFK, auto-respon, stiker
│   ├── compat/               # adapter pack vanXone & Rubby, global bersama, shim ruby-baileys
│   ├── dashboard/            # server Express + SPA (public/)
│   ├── utils/  tools/
├── plugins/                  # plugin native (main, group, owner, tools)
├── packs/
│   ├── vanxone/              # fitur vanXone v1.32 (CommonJS, 7 engine)
│   └── rubby/                # fitur Rubby-MD v1.5 (ESM)
├── assets/                   # gambar thumbnail / banner
└── data/                     # runtime: sesi, database, tmp, cadangan (tidak di-commit)
```

## Membuat plugin native

Taruh file `.js` di `plugins/<kategori>/`. Satu file boleh berisi satu objek atau array objek.

```js
export default {
  command: ['halo', 'hai'],       // nama pertama = nama utama
  category: 'fun',                // default: nama folder
  description: 'Menyapa pengguna',
  usage: '[nama]',
  group: false, admin: false, botAdmin: false, owner: false, premium: false, private: false, nsfw: false,
  cooldown: 3,
  async run(m, ctx) {
    // m: { chat, sender, isGroup, text, quoted, mentionedJid, reply(), react(), download() }
    // ctx: { sock, bot, db, settings, group, args, text, command, prefix, isOwner, isAdmin, isBotAdmin, groupMetadata }
    await m.reply(`Halo ${ctx.text || m.pushName}! 👋`)
  }
}
```

Muat ulang tanpa restart: kirim `.reload` (owner) atau tombol **Muat ulang plugin** di dashboard.

## Bagaimana pack Rubby & vanXone dijalankan

- Core yang mengurus koneksi, prefix, izin (owner/premium/admin/grup), statistik, dan dashboard. Pack hanya menyediakan perintah.
- Bila nama perintah dipakai lebih dari satu sumber, urutan default **native → vanxone → rubby**. Ubah per perintah di dashboard (*Modul & Perintah* → kolom *Sumber*) atau `.provider <perintah> <sumber>`.
- Penyimpanan internal vanXone (`lib/store.js`, `jstore.js`, `db.js`, `groups.js`) diarahkan ke database pilihan; file JSON lamanya dimigrasi otomatis sekali. Penyimpanan internal engine vanXone lain dan Rubby tetap di folder pack masing-masing.
- Database Rubby (`packs/rubby/lib/database.js`) diteruskan ke database core: premium, user, welcome/goodbye, dan plugin nonaktif sama dengan yang tampil di dashboard.

### Perubahan keamanan pada pack

- `ruby-baileys` (dependensi Rubby) sudah **ditarik dari npm** (yang tersisa hanya `0.0.1-security`). Diganti shim lokal `src/compat/shims/ruby-baileys` di atas Baileys resmi.
- `main.js` Rubby **diobfuscate** — tidak dipakai. Fungsinya ditulis ulang di `src/compat/`.
- Auto-join saluran & grup milik pembuat vanXone (`lib/autojoin.js`) **tidak dijalankan**.
- Kunci/token bawaan vanXone (token GitHub, bot Telegram, payment gateway AutoOrder, shoppanel) **tidak dipakai**; isi milikmu sendiri di `config/config.json` → `apiKeys` / `integrations`.
- File asli yang diganti disimpan di `data/backup/originals/` (tidak di-commit).

## Graphify

[Graphify](https://github.com/Graphify-Labs/graphify) memetakan kode project menjadi knowledge graph (`graphify-out/`).

```bash
uv tool install graphifyy        # sekali saja (perintah: graphify)
graphify install --project --platform claude
npm run graph                    # = graphify update .  (tanpa LLM)
```

Folder yang diabaikan ada di `.graphifyignore`. Di Claude Code ketik `/graphify .` untuk build lengkap.

## Pemecahan masalah

| Masalah | Solusi |
|---|---|
| Kode pairing ditolak | Pastikan nomor pakai kode negara tanpa `+`/spasi, minta kode baru (berlaku beberapa menit). |
| `Bad MAC` / pesan tidak terbaca terus | Jangan jalankan 2 bot dengan sesi yang sama. Jika berlanjut: `npm run reset-session` lalu login ulang. |
| "Perintah khusus owner" padahal owner | Isi nomor di *Pengaturan Bot → Nomor owner* (format `628xxx`). |
| MySQL `ECONNREFUSED` | Start MySQL di XAMPP, cek host/port/user di *Sistem & Database*. |
| Dashboard tidak bisa dibuka dari HP | Ubah host dashboard ke `0.0.0.0` (pakai password kuat), restart. |
| Fitur pack error "apikey" | Isi `apiKeys` di *Sistem & Database* atau `config/config.json`. |

## Kredit

- [WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys) · [discord-canvas](https://github.com/xixi52/discord-canvas) · [Graphify](https://github.com/Graphify-Labs/graphify)
- Rubby-MD oleh Kyuu · vanXone oleh Vann
- Versi awal: [dcode-denpa](https://github.com/dcode-denpa) · [MhankBarBar](https://github.com/MhankBarBar)
