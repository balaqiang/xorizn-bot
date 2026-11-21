module.exports = {
  name: 'calc',
  command: ['calc', 'hitung', 'kalkulator'],
  category: 'tools',
  desc: 'Kalkulator (+ - * / % ^ dan kurung)',
  usage: '<ekspresi>',
  run: async ({ text, prefix, reply }) => {
    if (!text) return reply(`Contoh: ${prefix}calc (12+8)*3/4`)

    const expr = text
      .replace(/[x×]/gi, '*')
      .replace(/[:÷]/g, '/')
      .replace(/\^/g, '**')
      .replace(/,/g, '.')

    // hanya angka, operator, titik, dan kurung yang boleh lewat
    if (expr.length > 100 || !/^[\d+\-*/%().\s]+$/.test(expr)) {
      return reply('Ekspresi tidak valid. Hanya angka dan operator + - * / % ^ ( ) yang diperbolehkan.')
    }

    let value
    try {
      value = Function(`"use strict"; return (${expr})`)()
    } catch {
      return reply('Ekspresi tidak valid.')
    }
    if (typeof value !== 'number' || !Number.isFinite(value)) return reply('Hasil tidak valid.')

    await reply(`${text} = *${Number(value.toFixed(10)).toLocaleString('id-ID', { maximumFractionDigits: 10 })}*`)
  }
}
