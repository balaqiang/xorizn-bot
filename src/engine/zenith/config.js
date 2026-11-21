// Jembatan config: plugin hasil port xorizn-bot memakai bentuk config yang sama dengan Xorizn,
// jadi cukup pakai ulang xorizn/config.js (identitas bot, APIkey proxy, isOwner/isPremium, dll).
import config, { isOwner, isPremium, isPartner, isBanned, isSelf, getOwnerName, getConfig } from '../nimbus/config.js'
export default config
export { config, isOwner, isPremium, isPartner, isBanned, isSelf, getOwnerName, getConfig }
// nama lama yang dipakai beberapa fitur xorizn-bot (sebelumnya tidak diekspor -> fitur gagal dimuat)
export const ZENITH_CORE_CONFIG = config
export const ZENITH_DEVELOPER = (config && config.bot && (config.bot.developer || config.bot.author)) || 'xorizn-bot'
