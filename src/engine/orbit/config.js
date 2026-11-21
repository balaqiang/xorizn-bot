// Jembatan config: plugin hasil port XORIZN-BOT memakai bentuk config yang sama dengan Xorizn,
// jadi cukup pakai ulang xorizn/config.js (identitas bot, APIkey proxy, isOwner/isPremium, dll).
import config, { isOwner, isPremium, isPartner, isBanned, isSelf, getOwnerName, getConfig } from '../nimbus/config.js'
export default config
export { config, isOwner, isPremium, isPartner, isBanned, isSelf, getOwnerName, getConfig }
