export const panel = (title, sections, options = {}) => {
  let res = `╭─── [ *${title}* ] ───\n`
  
  for (const sec of sections) {
    res += `│ ${sec.head}\n`
    for (const line of sec.lines) {
      res += `│ • ${line}\n`
    }
    res += `│\n` // Spasi antar section
  }
  
  res = res.trim() + `\n╰───────────────\n`
  
  if (options.tip) {
    res += `\n${options.tip}`
  }
  
  return res
}