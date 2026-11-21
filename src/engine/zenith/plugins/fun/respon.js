const pluginConfig = {
    name: "autozenith",
    alias: [],
    category: "fun",
    description: "Auto respon jika ada yang menyebut xorizn-bot",
    usage: ".autozenith on/off",
    example: ".autozenith on",
    cooldown: 3
}

// global agar tidak reset saat hot reload
if (!global.autoZenith) global.autoZenith = false

async function handler(m) {

    const text = (m.text || "").toLowerCase()
    const args = text.split(" ")[1]

    if (!args) {
        return m.reply(
`╭─〔 ❤️ XORIZN-BOT AUTO RESPON 〕
│
│ 📌 Perintah:
│ • .autozenith on
│ • .autozenith off
│
│ xorizn-bot akan otomatis
│ merespon jika namanya disebut.
│
╰────────────`
        )
    }

    if (args === "on") {
        global.autoZenith = true

        return m.reply(
`╭─〔 ❤️ XORIZN-BOT 〕
│
│ Ara ara~
│ Auto respon sekarang *AKTIF*
│
│ Panggil aku kapan saja
│ Darling~
│
╰────────────`
        )
    }

    if (args === "off") {
        global.autoZenith = false

        return m.reply(
`╭─〔 XORIZN-BOT 〕
│
│ Hmph!
│ Auto respon dimatikan.
│
│ Sampai jumpa Darling~
│
╰────────────`
        )
    }

}

async function before(m, { sock }) {

    if (!global.autoZenith) return

    const text = (m.text || "").toLowerCase()

    const trigger = [

        "xorizn-bot",
        "zenith",
        "02",
        "zenith",
        "zero2",
        "xorizn-bot ai",
        "zenith ai",
        "bot xorizn-bot",
        "xorizn-bot",
        "02 ai",
        "darling xorizn-bot",
        "zenithoo",
        "Zenithoo",
        "02 darling",
        "zenith chan",
        "zenith-chan"

    ]

    if (!trigger.some(v => text.includes(v))) return

    const name = m.pushName || "Darling"

    const respon = [

`╭─〔 ❤️ XORIZN-BOT 〕
│
│ Ara ara~
│ ${name} memanggilku?
│
│ Ada yang bisa
│ xorizn-bot bantu?
│
╰────────────`,

`╭─〔 XORIZN-BOT 〕
│
│ Fufu~
│ Aku mendengar
│ namaku disebut.
│
│ Halo ${name}.
│
╰────────────`,

`╭─〔 XORIZN-BOT 〕
│
│ Eh?
│ ${name} kangen aku ya?
│
│ Darling lucu~
│
╰────────────`,

`╭─〔 XORIZN-BOT 〕
│
│ Ara ara~
│ Jangan panggil aku
│ sembarangan.
│
│ ...tapi kalau kamu
│ boleh ${name}.
│
╰────────────`,

`╭─〔 XORIZN-BOT 〕
│
│ Hmph!
│ Siapa yang memanggil
│ xorizn-bot?
│
│ Oh ternyata kamu~
│
╰────────────`,

`╭─〔 XORIZN-BOT 〕
│
│ Darling ${name}~
│ Kamu memanggilku?
│
│ Aku datang ❤️
│
╰────────────`,

`╭─〔 XORIZN-BOT 〕
│
│ Fufu~
│ Aku merasa
│ seseorang menyebutku.
│
│ Hai ${name}.
│
╰────────────`,

`╭─〔 XORIZN-BOT 〕
│
│ Eh ${name}!
│ Kamu memanggil
│ xorizn-bot?
│
│ Aku disini~
│
╰────────────`

]

    const random = respon[Math.floor(Math.random() * respon.length)]

    await sock.sendMessage(m.chat, { text: random }, { quoted: m })

}
export { pluginConfig as config, handler, before };