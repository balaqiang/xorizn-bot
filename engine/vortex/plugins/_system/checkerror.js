module.exports = async function (__naren_imp, __naren_meta) {

const __ni_0 = await __naren_imp("fs"); const fs = __ni_0.default;
const __ni_1 = await __naren_imp("path"); const path = __ni_1.default;



let handler = async (m, { conn }) => {
    let pluginFolder = './plugins'
    let errorList = []

    if (!fs.existsSync(pluginFolder)) {
        return m.reply('❌ Folder *plugins* tidak ditemukan!')
    }

    let files = fs.readdirSync(pluginFolder).filter(file => file.endsWith('.js'))

    for (let file of files) {
        try {
            let plugin = await import(`file://${path.resolve(pluginFolder, file)}?update=${Date.now()}`)
            
            // cek apakah export default function
            let hasDefaultFunc = plugin?.default && typeof plugin.default === 'function'
            // cek apakah ada export before/after/cron
            let hasHook = plugin.before || plugin.after || plugin.cron

            if (!hasDefaultFunc && !hasHook) {
                throw new Error('Tidak ada export default function atau hook (before/after/cron)')
            }
        } catch (err) {
            errorList.push(`❌ *${file}* → ${err.message}`)
        }
    }

    if (errorList.length === 0) {
        m.reply('✅ Semua fitur aman, tidak ada error!')
    } else {
        m.reply(`🚨 Ditemukan *${errorList.length}* error pada fitur:\n\n${errorList.join('\n')}`)
    }
}

handler.help = ['checkerror']
handler.tags = ['owner']
handler.command = /^checkerror$/i
handler.rowner = true

const __naren_default = handler;
;return { default: __naren_default };
}
