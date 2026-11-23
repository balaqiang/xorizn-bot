<div align="center">
<img src="src/assets/images/thumbnail.jpg" alt="xorizn-bot" width="220" />

# XORIZN-BOT

Bot WhatsApp multi-device berbasis **Baileys v7** dengan **dashboard web localhost**,
fitur grup, owner, stiker, audio, downloader, daftar/limit/premium, **AI lewat 9router / OpenCode**, dan database **JSON, SQLite, MySQL (XAMPP), atau PostgreSQL (termasuk Supabase)**.

📢 Channel: https://whatsapp.com/channel/0029VbEAM5cGJP8FzJH1JH0R

</div>

---

## Fitur utama

- **Baileys 7 (rc14)** — login *pairing code* atau QR, auto-reconnect, dukungan LID (`@lid`) WhatsApp terbaru.
- **Dashboard TailAdmin (Next.js)** di `http://127.0.0.1:3000`: status & koneksi (minta kode pairing / scan QR dari browser), daftar grup yang diikuti bot, pengaturan per grup, modul & perintah (aktif/nonaktif, pilih sumber saat nama bentrok), pengguna (premium/ban/owner), AI / OpenCode (playground chat + lampiran), pengaturan bot, database, dan log realtime. Mode terang & gelap.
- **AI OpenCode lewat 9router** — perintah `.oc` dkk. menghubungkan WhatsApp ke OpenCode di komputer ini. AI bisa membaca **gambar, stiker, video, PDF, DOCX, XLSX, PPTX, file kode**, dan **voice note/audio** (ditranskripsi lewat 9router).
- **Welcome & goodbye bergambar** memakai [`discord-canvas`](https://www.npmjs.com/package/discord-canvas) — teks, warna, dan latar bisa diatur per grup, lengkap dengan pratinjau di dashboard.
- **Database pilihan**: `json` (satu file), `sqlite` (bawaan Node, tanpa instalasi), `mysql` (XAMPP/MariaDB), `postgres` (Postgres / **Supabase**). Data bisa dipindah antar-driver dari dashboard.
- **Fitur grup native**: anti-link (hapus/peringatan/kick), anti kata kasar, peringatan, bot on/off per grup, mode hanya-admin, NSFW per grup, auto-stiker, auto-respon, notifikasi promote/demote, hidetag/tagall, kick/add/promote/demote, buka/tutup grup, dll.
- **Stiker**: gambar/video/gif → stiker (`.s`), teks → stiker gaya brat (`.brat`, `.bratvid` animasi), stiker → gambar/video (`.toimg`), ganti pack (`.take`).
- **Audio**: video → MP3 (`.tomp3`), → voice note (`.tovn`), efek suara (`.bass`, `.nightcore`, `.slowed`, `.reverb`, `.8d`, `.robot`, `.tupai`, `.deep`, `.karaoke`, `.pitch`, `.tempo`, `.volume`, `.potongaudio`, dll.). Semua memakai ffmpeg bawaan, tanpa instal ffmpeg.
- **TTS & terjemahan**: `.tts [bahasa] teks` (voice note), `.tr [bahasa] teks` — tanpa API key.
- **Downloader bawaan**: `.play`, `.yts`, `.ytmp3`, `.ytmp4`, `.tiktok` (tanpa watermark / foto slide), `.ttmp3`, `.ig`, `.fb`, `.x`, `.dl <link apa pun>` — mesin yt-dlp (dipasang otomatis dari GitHub resmi) + tikwm untuk TikTok + cadangan untuk IG/FB/X.
- **AI chat**: `.ai` memakai penyedia OpenAI-compatible (9router, OpenRouter, Groq, Ollama) bila API key diisi di dashboard; kalau belum, otomatis memakai OpenCode. Bisa membaca gambar & dokumen, ingat percakapan (`.aireset` untuk hapus).
- **Daftar, limit & premium**: `.daftar nama.umur`, `.me`, `.limit`, `.cekprem`; limit harian untuk fitur berat (premium & owner bebas limit); opsi wajib daftar (`.wajibdaftar on`) dan atur limit (`.setlimit`, `.addlimit`) dari WhatsApp atau dashboard.
- **Perintah kustom tanpa ngoding**. Dari *Perintah Kustom*, pemilik dapat mencoba endpoint, melihat contoh respons, memilih daftar dan kolom, lalu mengirim teks atau media. API key disimpan di panel *Rahasia*. Versi cepat dari WhatsApp memakai `.addcustom nama | balasan`.
- **Integrasi n8n**: webhook keluar (event pesan, perintah, anggota grup; bertanda tangan HMAC; n8n bisa membalas) dan API masuk `POST /api/v1/send` dengan token.
- **Paket plugin**. Instalasi baru memuat plugin inti, *classic*, dan *extra*. Pemilik bisa mengubah pilihan paket di *Sistem & Database* serta mengatur perintah satu per satu di *Modul & Perintah*. Instalasi dengan pilihan paket tersimpan memakai pilihan tersebut.
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
git clone https://github.com/balaqiang/xorizn-bot
cd xorizn-bot
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
git clone https://github.com/balaqiang/xorizn-bot && cd xorizn-bot
npm install && npm start
```

Bila paket `canvas` gagal dibangun di Termux, kartu welcome otomatis memakai renderer cadangan (`@napi-rs/canvas`) dengan tata letak yang sama.

## Perintah npm

| Perintah | Fungsi |
|---|---|
| `npm start` | Jalankan bot lewat launcher (auto-restart saat crash / tombol Restart di dashboard) |
| `npm run start:raw` | Jalankan langsung tanpa launcher |
| `npm run dev` | Mode pengembangan (restart otomatis saat kode core berubah: `src/core`, `src/features`, `src/compat`, `src/dashboard`, `src/utils`, `src/plugins/core`) |
| `npm run check` | Muat semua plugin & dashboard tanpa menyambung ke WhatsApp |
| `npm run reset-session` | Pindahkan sesi login ke cadangan untuk login ulang / ganti nomor |
| `npm run build:dashboard` | Build ulang dashboard Next.js (hanya perlu bila mengubah `dashboard/src`) |
| `npm run graph` | Perbarui knowledge graph Graphify |

## Database

Atur di dashboard → **Sistem & Database**, atau `config/config.json`:

```jsonc
"database": {
  "driver": "json",                                  // json | sqlite | mysql | postgres
  "json":   { "file": "data/database.json" },
  "sqlite": { "file": "data/database.sqlite" },
  "mysql":  { "host": "127.0.0.1", "port": 3306, "user": "root", "password": "", "database": "xorizn_bot" },
  "postgres": { "connectionString": "postgresql://user:password@host:5432/postgres", "ssl": "auto" }
}
```

**Memakai XAMPP:** buka XAMPP Control Panel → *Start* modul **MySQL** → di dashboard pilih *MySQL / XAMPP* → **Tes koneksi** → **Pindahkan data & pakai** → restart.
Database `xorizn_bot` dan tabel `bot_store` dibuat otomatis (lihat isinya di phpMyAdmin).

**Memakai Supabase:** buka project Supabase → *Project Settings → Database → Connection string → URI* (pilih *Session pooler*) → tempel di dashboard → *Postgres / Supabase* → **Tes koneksi** → **Pindahkan data & pakai** → restart. Tabel `bot_store` (kolom `data` bertipe JSONB, bisa di-query dari Supabase) dibuat otomatis; SSL aktif otomatis.

Semua driver menyimpan baris `(collection, id, data JSON)` sehingga data bisa dipindah bolak-balik tanpa kehilangan isi.
Bila MySQL / Postgres tidak bisa dihubungi saat bot start, bot tetap jalan memakai JSON sementara dan dashboard menampilkan peringatan.

## Perintah kustom (tanpa ngoding)

### Atur `.gambar` dengan API sendiri

1. Buka **Perintah Kustom → Rahasia**. Beri nama, misalnya `GAMBAR_KEY`, masukkan API key, lalu pilih **Simpan rahasia**. Untuk API lokal, tambahkan `host:port` penyedia ke **Host lokal yang diizinkan**.
2. Pilih **Gambar dari API saya**. Isi **URL endpoint**, kemudian pilih nama rahasia pada **API key untuk Authorization Bearer**. Untuk penyedia dengan header lain, isi misalnya `{"X-API-Key":"{{secret.GAMBAR_KEY}}"}` di **Header (JSON)**. Untuk kueri pencarian, isi misalnya `{"q":"{{text}}"}` di **Query (JSON)** dan masukkan kata pencarian di **Coba dulu**.
3. Klik **Coba permintaan**. Panel menampilkan contoh respons dari endpoint. Di langkah **Pilih acak dari daftar**, atur pilihan sesuai bentuk respons.

   | Respons API | Pilih daftar dari contoh | Kolom pada item |
   |---|---|---|
   | `{"result":{"images":["https://contoh.id/a.png"]}}` | `res.result.images` | Kosongkan |
   | `{"data":{"items":[{"url":"https://contoh.id/b.png"}]}}` | `res.data.items` | `url` |

4. Di langkah **Balas**, pilih **Any (deteksi jenis file)** dan gunakan `{{img}}` sebagai sumber file. Jika penyedia bergantian mengirim gambar dan MP4, bot mengenali isi file pada setiap permintaan. Klik **▶ Coba** untuk melihat jenis balasan dan thumbnail gambar. Untuk API yang mengembalikan file langsung, gunakan langkah HTTP dengan jenis respons otomatis lalu isi sumber file dengan `{{res}}`.
5. Saat paket *classic* aktif, `.gambar` sudah menjadi alias pencarian gambar. Centang **Timpa perintah bawaan bernama sama** jika ingin mengarahkan nama itu ke perintah ini. Klik **Simpan**, lalu kirim `.gambar` dari WhatsApp yang terhubung. Gunakan prefix yang telah Anda pilih jika berbeda. Pencarian classic tetap tersedia melalui `.gimg`.
6. Untuk berpindah penyedia, klik **Ubah** di baris `.gambar`, ganti endpoint dan referensi key, lalu ulangi langkah 3–5. Nama perintah dan jumlah pemakaiannya dipertahankan.

Dalam **Ambil data** versi lama, `res.result.images.random` memilih satu item saat `images` berupa daftar. Jika `images` berupa objek dengan kolom `random`, ekspresi itu membaca nilai kolom. Dalam langkah **Pilih acak dari daftar**, setiap segmen path adalah nama kolom atau indeks. Misalnya, untuk `{"images":{"random":["a","b"]}}`, gunakan path `res.images.random`. Langkah itulah yang mengambil satu item acak dari daftar.

Lihat perbandingan ketiga cara memilih data, bukti integrasi, serta perintah untuk mengulang pengujian di [panduan verifikasi](docs/VERIFIKASI.md).

### Langkah yang bisa dirangkai

Buka dashboard → **Perintah Kustom** → *Perintah baru* (atau pilih contoh). Setiap perintah adalah rangkaian langkah:

| Langkah | Fungsi |
|---|---|
| 🌐 Panggil API | GET/POST/PUT/PATCH/DELETE, header, query, body JSON/form. Hasil disimpan ke variabel (bawaan `res`). |
| 🎯 Ambil data | Path seperti `res.result.images.random`, `res.data[0].url`, `res.list.length` |
| ✅ Cek syarat | ada / kosong / sama / mengandung / lebih dari / regex — bila gagal, kirim pesan lalu berhenti |
| 📝 Simpan, 🎲 Acak | Simpan teks/variabel, pilih acak dari daftar |
| 💬 Balas | Langkah baru memakai Teks. Untuk mengirim file, pilih Any agar bot mendeteksi jenisnya. Jenis media juga bisa dipilih manual, termasuk voice note dan stiker. |
| 🤖 Tanya AI, 😀 Reaksi, ⏱️ Jeda, ⏹️ Selesai | — |

**Template:** `{{text}}` (teks setelah perintah), `{{arg1}}`, `{{sender.name}}`, `{{sender.number}}`, `{{chat.name}}`, `{{quoted.text}}`, `{{date}}`, `{{time}}`, hasil langkah (`{{res.title}}`).
Modifier path: `random first last length reverse shuffle keys values`, indeks `[0]` / `-1`.
Filter: `{{res.title | upper | default:-}}` — upper, lower, trim, default:x, truncate:n, join:sep, urlencode, json, number.

**Rahasia:** simpan API key di panel *Rahasia* (terenkripsi AES-256-GCM, kunci di `data/secret.key`), pakai di header/query/URL dengan `{{secret.NAMA}}`. Nilai rahasia tidak pernah ditampilkan lagi dan di teks balasan selalu tampil `***`.

**Keamanan & ketahanan:**
- Tanpa `eval` — path & template dibaca oleh parser khusus; `__proto__`/`constructor` ditolak.
- Anti-SSRF — API ke localhost, IP privat, dan alamat metadata cloud diblokir (termasuk domain yang di-resolve ke IP privat dan redirect). Host lokal yang memang dipakai (mis. n8n `localhost:5678`) ditambahkan di *Host lokal yang diizinkan*.
- Batas: 25 langkah, 5 panggilan HTTP, 5 balasan, 90 detik, respons API 5 MB, media 25 MB.
- Perintah yang error hanya membalas pesan error ke pengguna; detailnya tampil di dashboard (*Error terakhir*). Bot tidak berhenti.
- Nama yang bentrok dengan fitur bawaan ditolak, kecuali centang *Timpa perintah bawaan*.

Contoh (mode JSON di editor):

```json
{
  "name": "kucing",
  "description": "Gambar kucing acak",
  "flags": { "limit": 1 },
  "steps": [
    { "type": "http", "url": "https://api.thecatapi.com/v1/images/search?limit=5", "save": "res" },
    { "type": "pick", "path": "res.random.url", "save": "img", "failText": "Gambar tidak ditemukan." },
    { "type": "reply", "kind": "image", "url": "{{img}}", "text": "🐱 Nih {{sender.name}}" }
  ]
}
```

Dari WhatsApp (owner): `.addcustom nama | balasan`, `.listcustom`, `.togglecustom nama on/off`, `.delcustom nama`.

## Integrasi n8n

Dashboard → **Integrasi (n8n)**.

**Webhook keluar** — bot mengirim `POST` JSON ke URL n8n (node *Webhook*) untuk event yang dipilih:

```json
{ "event": "message", "bot": { "name": "xorizn-bot", "number": "628..." }, "at": 1790000000000,
  "data": { "chat": "628...@s.whatsapp.net", "isGroup": false, "sender": "628...@s.whatsapp.net", "senderName": "Budi", "type": "conversation", "text": "halo", "quotedText": "" } }
```

Event: `message` (pesan masuk), `command` (perintah dijalankan, + `command`, `args`, `ok`), `group` (anggota masuk/keluar/promote/demote).
Header `X-Xorizn-Signature: sha256=<HMAC-SHA256 body dengan secret webhook>` untuk verifikasi. Aktifkan *Balas dari n8n* agar respons `{"reply": "teks"}` dari node *Respond to Webhook* dikirim ke chat asal.

**API masuk** — aktifkan API dan buat token, lalu dari n8n (node *HTTP Request*):

```bash
curl -X POST http://127.0.0.1:3000/api/v1/send \
  -H "Authorization: Bearer TOKEN_KAMU" -H "Content-Type: application/json" \
  -d '{"to":"628123456789","text":"Halo dari n8n"}'
```

Field: `text`, `image` / `video` / `audio` / `document` / `sticker` (URL), `caption`, `fileName`, `ptt`. `to` bisa nomor (`08…` / `628…`), JID pengguna, atau JID grup. Endpoint lain: `GET /api/v1/status`, `GET /api/v1/groups`. Maksimal 60 permintaan/menit.

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
xorizn-bot/
├── src/                      # semua kode bot
│   ├── index.js              # titik masuk: config → db → plugin → dashboard → WhatsApp
│   ├── launcher.js           # menjalankan & me-restart index.js
│   ├── package.json          # dibaca beberapa plugin classic (./package.json)
│   ├── core/                 # koneksi Baileys, serializer, handler, registri perintah, cache, model data
│   │   ├── config.js         # pemuat config/config.json + daftar path
│   │   ├── logger.js
│   │   └── database/         # Database + driver json / sqlite / mysql
│   ├── features/             # welcome, moderasi, stiker, audio, downloader, AI, limit, integrasi n8n, OpenCode, pembaca media
│   │   └── builder/          # perintah kustom: template/path, HTTP aman (anti-SSRF), rahasia terenkripsi, runner
│   ├── compat/               # adapter classic & extra, global bersama, modul xorizn-baileys
│   ├── dashboard/server.js   # server Express: API + menyajikan dashboard/out
│   ├── utils/  tools/
│   ├── plugins/
│   │   ├── core/             # plugin native (main, group, owner, tools, ai) — ESM
│   │   ├── extra/            # plugin extra per kategori — ESM
│   │   └── <kategori>/       # plugin classic: ai, downloader, game, group, tools, ... — CommonJS
│   ├── engine/               # 7 engine: aurora, lumen, nimbus, orbit, pulse, vortex, zenith
│   ├── lib/                  # library classic (CommonJS) + runtime.js
│   │   └── extra/            # library extra (ESM)
│   ├── config/               # adaptor konfigurasi untuk plugin classic (index.js, settings.js — membaca dari core)
│   ├── scrape/               # scraper plugin extra
│   ├── database/             # data runtime plugin classic/engine (dibuat otomatis, tidak di-commit)
│   ├── media/  assets/  bin/ # gambar, font, media menu, aset maker, alat (yt-dlp)
│   └── tmp/                  # file sementara (tidak di-commit)
├── config/
│   ├── config.example.json   # template konfigurasi (di-commit)
│   └── config.json           # konfigurasi lokal (TIDAK di-commit: password & API key)
├── dashboard/                # dashboard Next.js + TailAdmin (src/ = sumber, out/ = hasil build yang disajikan bot)
├── docs/                     # daftar fitur (FITUR.md), panduan AutoOrder, lisensi pihak ketiga (licenses/)
└── data/                     # runtime: sesi, database, cadangan (tidak di-commit)
```

Tiap folder ber-format modul berbeda punya `package.json` kecil (`"type": "commonjs"` / `"module"`), jadi plugin classic (CommonJS) dan extra/core (ESM) bisa hidup berdampingan.
Saat berjalan, direktori kerja bot = folder `src/`, karena banyak plugin classic/extra memakai path relatif (`./database/...`, `./engine/...`, `./tmp`). Data runtime (sesi, database pilihan, cadangan) tetap di `data/` dan konfigurasi di `config/` pada root project.

## Membuat plugin native

Taruh file `.js` di `src/plugins/core/<kategori>/`. Satu file boleh berisi satu objek atau array objek.

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

## Bagaimana fitur classic & extra dijalankan

- Core yang mengurus koneksi, prefix, izin (owner/premium/admin/grup), statistik, dan dashboard. Runtime classic (`src/lib/runtime.js`) dan extra (`src/lib/extra/`) hanya menyediakan perintah.
- Plugin classic (`run(ctx)`, CommonJS) ditaruh di `src/plugins/<kategori>/`; plugin extra (`handler(m, ctx)`, ESM) di `src/plugins/extra/<kategori>/`; format native di `src/plugins/core/<kategori>/`.
- Bila nama perintah dipakai lebih dari satu sumber, urutan default **native → classic → extra**. Ubah per perintah di dashboard (*Modul & Perintah* → kolom *Sumber*) atau `.provider <perintah> <sumber>`.
- Penyimpanan internal plugin classic (`src/lib/store.js`, `jstore.js`, `db.js`, `groups.js`) diarahkan ke database pilihan (nilai awalnya ada di kode; file JSON lama di `src/database/` bila ada dimigrasi otomatis sekali). Penyimpanan internal engine lain tetap berupa file di `src/engine/` dan `src/database/`.
- Database plugin extra (`src/lib/extra/database.js`) diteruskan ke database core: premium, user, welcome/goodbye, dan plugin nonaktif sama dengan yang tampil di dashboard. Perintah owner extra `setnamebot`/`setthumb`/`setweb` kini menyimpan ke pengaturan bot.

### Perubahan keamanan

- Paket Baileys turunan yang dipakai plugin extra sudah **ditarik dari npm**. Diganti modul lokal `src/compat/shims/xorizn-baileys` di atas Baileys resmi.
- `main.js` asli plugin extra **diobfuscate** — tidak dipakai. Fungsinya ditulis ulang di `src/compat/`.
- Auto-join saluran & grup milik pembuat lama beserta kunci anti-ubahnya (`lib/autojoin.js`, `lib/integrity.js`) **dihapus**.
- Kunci/token bawaan pembuat lama (token GitHub, bot Telegram, payment gateway AutoOrder, shoppanel, kunci API neoxr & kyzz) **tidak dipakai**; isi milikmu sendiri di `config/config.json` → `apiKeys` / `integrations`.
- File asli yang diganti disimpan di `data/backup/originals/`, dan salinan utuh folder `packs/` sebelum digabung ada di `data/backup/packs-2026-11-21.tar.gz` (keduanya tidak di-commit; versi lengkapnya juga ada di riwayat git).
- Banner, kredit, dan link channel pembuat lama sudah dihapus. Semua link channel mengarah ke channel bot — ubah di dashboard → *Pengaturan Bot → Link channel WhatsApp* (JID channel diambil otomatis saat bot tersambung).

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
| Fitur classic/extra error "apikey" | Isi `apiKeys` di *Sistem & Database* atau `config/config.json` (mis. `neoxr`, `kyzz`). |
| Perintah kustom: "...jaringan lokal/privat dan diblokir" | API mengarah ke localhost/IP privat. Bila memang disengaja (mis. n8n lokal), tambahkan `host:port` di *Perintah Kustom → Host lokal yang diizinkan*. |
| Webhook n8n tidak terpanggil | Cek status di *Integrasi* (badge OK/gagal) dan tombol *Kirim tes*. Pastikan workflow n8n aktif (URL *Production*). |
| Downloader: "yt-dlp belum terpasang" | Owner kirim `.ytdlp install` (unduh dari GitHub resmi), atau aktifkan *Pasang yt-dlp otomatis* di dashboard. Di Termux: `pkg install python ffmpeg && pip install -U "yt-dlp[default]"`. |
| YouTube minta verifikasi / IG minta login | Taruh cookies akun (format Netscape) di `src/bin/cookies.txt`, atau proxy di `src/bin/proxy.txt`. Cek dengan `.ytdlp`. |
| `.ai` memakai OpenCode, bukan 9router | Isi *Base URL* & *API key* di dashboard → *Pengaturan Bot → AI chat*. Tanpa API key, `.ai` otomatis memakai OpenCode. |
| `.oc` menjawab "Server OpenCode tidak bisa dihubungi" | Nyalakan OpenCode: `.ocstart`, tombol *Jalankan OpenCode* di dashboard, atau `opencode service start`. |
| `.oc` menjawab "Kuota / rate limit habis" | Kuota model di 9router habis (mis. Gemini gratis). Pilih model lain dengan `.ocmodels` → `.ocmodel <nomor>`. |
| Voice note tidak terbaca | Isi API key 9router di dashboard → *AI / OpenCode* → *Transkripsi audio*. |
| Halaman dashboard "belum di-build" | Jalankan `npm run build:dashboard`. |

## Kredit

- Kode proyek memakai [lisensi ISC](LICENSE) yang tercantum di `package.json`. Template dashboard menyertakan [lisensi MIT TailAdmin](dashboard/LICENSE.tailadmin).
- [WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys) · [discord-canvas](https://github.com/xixi52/discord-canvas) · [Graphify](https://github.com/Graphify-Labs/graphify)
- [TailAdmin Free Next.js](https://github.com/TailAdmin/free-nextjs-admin-dashboard) · [OpenCode](https://opencode.ai) · [9router](https://github.com/decolua/9router)
- Lisensi kode pihak ketiga yang dipakai ada di `docs/licenses/`.
- Versi awal: [dcode-denpa](https://github.com/dcode-denpa) · [MhankBarBar](https://github.com/MhankBarBar)
