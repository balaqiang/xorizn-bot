<div align="center">
<img src="assets/images/thumbnail.jpg" alt="Bitch Bot" width="220" />

# BITCH BOT v2

Bot WhatsApp multi-device berbasis **Baileys v7** dengan **dashboard web localhost**,
gabungan fitur **Rubby-MD** + **vanXone** (±2.390 perintah), **AI OpenCode lewat 9router**, dan pilihan database **JSON / SQLite / MySQL (XAMPP)**.

</div>

---

## Fitur utama

- **Baileys 7 (rc14)** — login *pairing code* atau QR, auto-reconnect, dukungan LID (`@lid`) WhatsApp terbaru.
- **Dashboard TailAdmin (Next.js)** di `http://127.0.0.1:3000`: status & koneksi (minta kode pairing / scan QR dari browser), daftar grup yang diikuti bot, pengaturan per grup, modul & perintah (aktif/nonaktif, pilih sumber saat nama bentrok), pengguna (premium/ban/owner), AI / OpenCode (playground chat + lampiran), pengaturan bot, database, dan log realtime. Mode terang & gelap.
- **AI OpenCode lewat 9router** — perintah `.oc` dkk. menghubungkan WhatsApp ke OpenCode di komputer ini. AI bisa membaca **gambar, stiker, video, PDF, DOCX, XLSX, PPTX, file kode**, dan **voice note/audio** (ditranskripsi lewat 9router).
- **Welcome & goodbye bergambar** memakai [`discord-canvas`](https://www.npmjs.com/package/discord-canvas) — teks, warna, dan latar bisa diatur per grup, lengkap dengan pratinjau di dashboard.
- **Database pilihan**: `json` (satu file), `sqlite` (bawaan Node, tanpa instalasi), `mysql` (XAMPP/MariaDB). Data bisa dipindah antar-driver dari dashboard.
- **Fitur grup native**: anti-link (hapus/peringatan/kick), anti kata kasar, peringatan, bot on/off per grup, mode hanya-admin, NSFW per grup, auto-stiker, auto-respon, notifikasi promote/demote, hidetag/tagall, kick/add/promote/demote, buka/tutup grup, dll.
- **Semua fitur vanXone & Rubby** digabung langsung ke project: vanXone v1.32 (2.257 plugin dari 7 engine) dan Rubby-MD v1.5 (268 plugin).
- **Graphify** terpasang untuk memetakan kode project menjadi knowledge graph.

## Persyaratan

| | |
|---|---|
| Node.js | **22.5 atau lebih baru** (disarankan 22 LTS / 24). SQLite memakai modul bawaan `node:sqlite`. |
| FFmpeg | Sudah ikut lewat `ffmpeg-static` (Windows/Linux x64). Di Termux: `pkg install ffmpeg`. |
| MySQL | Opsional — hanya jika memilih driver `mysql` (XAMPP / MariaDB / MySQL). |
| OpenCode + 9router | Opsional — untuk fitur AI (`npm i -g @opencode/cli` dan `npm i -g 9router`). |
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
| `npm run build:dashboard` | Build ulang dashboard Next.js (hanya perlu bila mengubah `dashboard/src`) |
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

## AI OpenCode (lewat 9router)

Bot bisa meneruskan pertanyaan dari WhatsApp ke **OpenCode** yang terpasang di komputer yang sama. OpenCode memakai provider
**9router** (`http://localhost:20128/v1`), sehingga model yang tersedia sama dengan yang kamu atur di 9router.

**Cara menghubungkan**

1. Pasang & jalankan: `npm i -g @opencode/cli 9router`, lalu `9router` (dashboard 9router di port 20128).
2. Pastikan OpenCode sudah memakai provider 9router (lihat `~/.config/opencode/opencode.json`).
3. Nyalakan server OpenCode: buka aplikasi OpenCode, jalankan `opencode service start`, kirim `.ocstart` (owner), atau klik **Jalankan OpenCode** di dashboard → *AI / OpenCode*.
4. Bot menemukan server & password-nya otomatis dari `~/.local/state/opencode/service.json`. Tidak perlu isi apa pun.
5. (Opsional) Isi **API key 9router** di dashboard → *AI / OpenCode* agar voice note & audio bisa dibaca.

**Perintah WhatsApp**

| Perintah | Fungsi |
|---|---|
| `.oc <pertanyaan>` | Tanya AI. Kirim/reply gambar, stiker, video, voice note, PDF, DOCX, XLSX, PPTX, atau file kode dengan caption `.oc` agar dibaca AI. Reply jawaban bot = lanjut bertanya. |
| `.ocmodels [filter]` | Daftar model (🖼️ bisa baca gambar, 🎧 audio, ⚙️ punya pilihan effort) |
| `.ocmodel <nomor\|provider/model>` | Pilih model, mis. `.ocmodel 5` atau `.ocmodel 9router/gemini/gemini-3.5-flash-lite` |
| `.oceffort <low\|medium\|high\|…\|off>` | Reasoning effort (variant) — hanya untuk model bertanda ⚙️ |
| `.ocagent <build\|plan>` | Pilih agent OpenCode |
| `.ocnew [judul]` | Mulai sesi baru |
| `.ocsessions` | Daftar sesi terbaru |
| `.ocopen <nomor\|id>` | Buka / lanjutkan sesi |
| `.ocstop` | Hentikan jawaban yang sedang berjalan |
| `.ocizin ya\|selalu\|tolak` | Jawab permintaan izin shell/edit (owner, mode *Tanya*) |
| `.ocstart` | Nyalakan server OpenCode (owner) |
| `.ocstatus` / `.ochelp` | Status koneksi / panduan |

**Keamanan.** OpenCode adalah agen yang bisa menjalankan perintah di komputermu, jadi:

- Default hanya **owner** yang bisa memakai (`Siapa yang boleh memakai` → owner / owner + premium / semua).
- Mode izin default **Aman**: AI hanya boleh membaca, tanpa shell, tanpa edit file, tanpa akses di luar folder kerja `data/opencode-workspace`.
  Mode **Tanya** meneruskan permintaan izin ke WhatsApp (`.ocizin`); mode **Penuh** mengizinkan semuanya. Pengguna selain owner selalu memakai mode Aman.

**Cara media dibaca**

| Media | Cara |
|---|---|
| Gambar, stiker (statis/animasi) | dikirim sebagai lampiran gambar (model 🖼️) |
| Video | beberapa cuplikan frame + transkrip suara |
| Voice note / audio | ditranskripsi lewat 9router (butuh API key 9router), karena OpenCode belum meneruskan audio ke model |
| PDF | teks diekstrak; PDF hasil scan dirender jadi gambar per halaman |
| DOCX, XLSX, PPTX, ODT, RTF, file teks/kode | teks diekstrak lalu disertakan ke pertanyaan |

Bila kuota model habis (mis. error 429 dari Gemini gratis di 9router), bot memberi tahu dan menyarankan model lain lewat `.ocmodel`.

## Dashboard (Next.js + TailAdmin)

Dashboard dibangun dari template [TailAdmin Free Next.js](https://github.com/TailAdmin/free-nextjs-admin-dashboard) (MIT, lihat `dashboard/LICENSE.tailadmin`)
dan di-export statis ke `dashboard/out`, yang langsung disajikan server bot — jadi pengguna tidak perlu menjalankan Next.js.
Hasil build ikut di-commit, sehingga di Termux pun dashboard bisa dipakai tanpa build.

Mengubah tampilan: edit file di `dashboard/src`, lalu `npm run build:dashboard` (atau `npm --prefix dashboard run dev` untuk mode pengembangan di port 3001, dengan bot tetap berjalan di port 3000 untuk API).

## Struktur project

```
bitch-bot/
├── src/                      # core bot (ESM)
│   ├── index.js              # titik masuk: config → db → plugin → dashboard → WhatsApp
│   ├── launcher.js           # menjalankan & me-restart index.js
│   ├── core/                 # koneksi Baileys, serializer, handler, registri perintah, cache, model data
│   ├── database/             # Database + driver json / sqlite / mysql
│   ├── features/             # welcome (discord-canvas), moderasi, AFK, auto-respon, stiker
│   ├── compat/               # adapter vanXone & Rubby, global bersama, shim ruby-baileys
│   ├── dashboard/            # server Express + SPA (public/)
│   └── utils/  tools/
├── plugins/
│   ├── core/                 # plugin native (main, group, owner, tools) — ESM
│   ├── rubby/                # plugin Rubby-MD per kategori — ESM
│   └── <kategori>/           # plugin vanXone: ai, downloader, game, group, tools, ... — CommonJS
├── engine/                   # 7 engine vanXone: aurora, lumen, nimbus, orbit, pulse, vortex, zenith
├── lib/                      # library vanXone (CommonJS) + runtime.js
│   └── rubby/                # library Rubby (ESM)
├── scrape/                   # scraper Rubby
├── dashboard/                # dashboard Next.js + TailAdmin (src/ = sumber, out/ = hasil build yang disajikan bot)
├── config/
│   ├── config.example.json   # template konfigurasi (di-commit)
│   ├── config.json           # konfigurasi lokal (TIDAK di-commit: password & API key)
│   └── index.js settings.js  # adaptor konfigurasi untuk kode vanXone (membaca dari core)
├── database/                 # data bawaan vanXone (soal kuis, dll.)
├── media/  assets/  bin/     # gambar, font, media menu, aset maker, alat (yt-dlp)
├── docs/                     # dokumentasi asli vanXone & Rubby (FITUR.md, LICENSE, ...)
├── tmp/                      # file sementara (tidak di-commit)
└── data/                     # runtime: sesi, database, cadangan (tidak di-commit)
```

Tiap folder ber-format modul berbeda punya `package.json` kecil (`"type": "commonjs"` / `"module"`), jadi file vanXone (CommonJS) dan Rubby/core (ESM) bisa hidup berdampingan.
Bot selalu dijalankan dengan direktori kerja = root project, karena banyak kode vanXone/Rubby memakai path relatif (`./database/...`, `./engine/...`, `./tmp`).

## Membuat plugin native

Taruh file `.js` di `plugins/core/<kategori>/`. Satu file boleh berisi satu objek atau array objek.

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

## Bagaimana fitur Rubby & vanXone dijalankan

- Core yang mengurus koneksi, prefix, izin (owner/premium/admin/grup), statistik, dan dashboard. Kode vanXone (`lib/runtime.js`) dan Rubby (`lib/rubby/`) hanya menyediakan perintah.
- Plugin format vanXone (`run(ctx)`, CommonJS) ditaruh di `plugins/<kategori>/`; format Rubby (`handler(m, ctx)`, ESM) di `plugins/rubby/<kategori>/`; format native di `plugins/core/<kategori>/`.
- Bila nama perintah dipakai lebih dari satu sumber, urutan default **native → vanxone → rubby**. Ubah per perintah di dashboard (*Modul & Perintah* → kolom *Sumber*) atau `.provider <perintah> <sumber>`.
- Penyimpanan internal vanXone (`lib/store.js`, `jstore.js`, `db.js`, `groups.js`) diarahkan ke database pilihan; file JSON lamanya dimigrasi otomatis sekali. Penyimpanan internal engine vanXone lain tetap berupa file di `engine/` dan `database/`.
- Database Rubby (`lib/rubby/database.js`) diteruskan ke database core: premium, user, welcome/goodbye, dan plugin nonaktif sama dengan yang tampil di dashboard. Perintah owner Rubby `setnamebot`/`setthumb`/`setweb` kini menyimpan ke pengaturan bot.

### Perubahan keamanan

- `ruby-baileys` (dependensi Rubby) sudah **ditarik dari npm** (yang tersisa hanya `0.0.1-security`). Diganti shim lokal `src/compat/shims/ruby-baileys` di atas Baileys resmi.
- `main.js` Rubby **diobfuscate** — tidak dipakai. Fungsinya ditulis ulang di `src/compat/`.
- Auto-join saluran & grup milik pembuat vanXone (`lib/autojoin.js`) **tidak dijalankan**.
- Kunci/token bawaan vanXone (token GitHub, bot Telegram, payment gateway AutoOrder, shoppanel) **tidak dipakai**; isi milikmu sendiri di `config/config.json` → `apiKeys` / `integrations`.
- File asli yang diganti disimpan di `data/backup/originals/`, dan salinan utuh folder `packs/` sebelum digabung ada di `data/backup/packs-2026-11-21.tar.gz` (keduanya tidak di-commit; versi lengkapnya juga ada di riwayat git).

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
| Fitur vanXone/Rubby error "apikey" | Isi `apiKeys` di *Sistem & Database* atau `config/config.json`. |
| `.oc` menjawab "Server OpenCode tidak bisa dihubungi" | Nyalakan OpenCode: `.ocstart`, tombol *Jalankan OpenCode* di dashboard, atau `opencode service start`. |
| `.oc` menjawab "Kuota / rate limit habis" | Kuota model di 9router habis (mis. Gemini gratis). Pilih model lain dengan `.ocmodels` → `.ocmodel <nomor>`. |
| Voice note tidak terbaca | Isi API key 9router di dashboard → *AI / OpenCode* → *Transkripsi audio*. |
| Halaman dashboard "belum di-build" | Jalankan `npm run build:dashboard`. |

## Kredit

- [WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys) · [discord-canvas](https://github.com/xixi52/discord-canvas) · [Graphify](https://github.com/Graphify-Labs/graphify)
- [TailAdmin Free Next.js](https://github.com/TailAdmin/free-nextjs-admin-dashboard) · [OpenCode](https://opencode.ai) · [9router](https://github.com/decolua/9router)
- Rubby-MD oleh Kyuu · vanXone oleh Vann
- Versi awal: [dcode-denpa](https://github.com/dcode-denpa) · [MhankBarBar](https://github.com/MhankBarBar)
