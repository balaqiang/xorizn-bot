import '../import.js';

import {
  generateWAMessageFromContent,
  generateWAMessage,
  prepareWAMessageMedia,
  proto
} from '@whiskeysockets/baileys'

import crypto from 'crypto'

const bizNode = {
  tag: 'biz',
  attrs: {},
  content: [{
    tag: 'interactive',
    attrs: { type: 'native_flow', v: '1' },
    content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }]
  }]
}

export default function makeButtonsHelper(sock) {

  const buildMsg = (jid, content, options = {}) =>
    generateWAMessageFromContent(jid, content, {
      userJid: sock.user?.id,
      quoted: options.quoted
    })

  const uploadMedia = async (content) =>
    prepareWAMessageMedia(content, { upload: sock.waUploadToServer })

  const buildHeader = async (content = {}) => {
    if (content.image) {
      const m = await uploadMedia({ image: content.image })
      return { hasMediaAttachment: true, imageMessage: m.imageMessage }
    }
    if (content.video) {
      const m = await uploadMedia({ video: content.video })
      return { hasMediaAttachment: true, videoMessage: m.videoMessage }
    }
    if (content.document) {
      const m = await uploadMedia({
        document: content.document,
        mimetype: content.mimetype || 'application/octet-stream',
        fileName: content.filename || 'file'
      })
      return { hasMediaAttachment: true, documentMessage: m.documentMessage }
    }
    if (content.location) {
      return {
        hasMediaAttachment: true,
        locationMessage: {
          degreesLatitude: content.location.lat || 0,
          degreesLongitude: content.location.lng || 0,
          name: content.location.name || '',
          address: content.location.address || '',
          jpegThumbnail: content.location.jpegThumbnail || Buffer.from([])
        }
      }
    }

    if (content.catalog) {
      const cat = content.catalog
      let productImage
      if (cat.image) {
        const m = await uploadMedia({ image: cat.image })
        productImage = m.imageMessage
      }
      return {
        hasMediaAttachment: true,
        productMessage: {
          product: {
            productImage,
            productId: cat.productId || '',
            title: cat.title || '',
            currencyCode: cat.currency || 'IDR',
            priceAmount1000: (cat.price || 0) * 1000,
            retailerId: cat.retailerId || '',
            url: cat.url || '',
            productImageCount: 1
          },
          businessOwnerJid: cat.businessJid || ''
        }
      }
    }
    return { hasMediaAttachment: false }
  }

  const convertButtons = (buttons = []) => buttons.map((btn, i) => {
    if (btn.name) return btn

    const text = btn.displayText || btn.text || ''

    if (btn.url) return {
      name: 'cta_url',
      buttonParamsJson: JSON.stringify({
         display_text: text,
         url: btn.url
      })
    }

    if (btn.copy || btn.copyCode) return {
      name: 'cta_copy',
      buttonParamsJson: JSON.stringify({
         display_text: text,
         copy_code: btn.copy || btn.copyCode
      })
    }

    if (btn.call || btn.phone) return {
      name: 'cta_call',
      buttonParamsJson: JSON.stringify({
         display_text: text,
         phone_number: btn.call || btn.phone
      })
    }

    if (btn.type === 'reminder' || btn.reminder) return {
      name: 'cta_reminder',
      buttonParamsJson: JSON.stringify({
        display_text: text
      })
    }

    if (btn.type === 'send_location' || btn.type === 'location') return {
      name: 'send_location',
      buttonParamsJson: JSON.stringify({})
     }

    if (btn.type === 'address') return {
      name: 'address_message',
      buttonParamsJson: JSON.stringify({
        display_text: text
      })
    }

    if (btn.transaction_id || btn.type === 'payment_transaction') return {
      name: 'wa_payment_transaction_details',
      buttonParamsJson: JSON.stringify({
         transaction_id: btn.transaction_id || ''
      })
    }

    if (btn.type === 'review_and_pay' || btn.review_and_pay) return {
      name: 'review_and_pay',
      buttonParamsJson: JSON.stringify(btn.review_and_pay || btn.params || {})
    }

    if (btn.product_id || btn.type === 'mpm') return {
      name: 'mpm',
      buttonParamsJson: JSON.stringify({
        product_id: btn.product_id || ''
      })
    }

    if (btn.catalog_product_id || btn.type === 'catalog') return {
      name: 'automated_greeting_message_view_catalog',
      buttonParamsJson: JSON.stringify({
        business_phone_number: btn.business_phone_number || '', catalog_product_id: btn.catalog_product_id || ''
      })
    }

    if (btn.type === 'catalog_message' || btn.thumbnail_product_retailer_id) return {
      name: 'catalog_message',
      buttonParamsJson: JSON.stringify({
        thumbnail_product_retailer_id: btn.thumbnail_product_retailer_id || btn.retailerId || ''
      })
    }

    if (btn.flow_id || btn.galaxy_message || btn.type === 'galaxy') return {
      name: 'galaxy_message',
      buttonParamsJson: JSON.stringify({
        flow_message_version: btn.flow_message_version || '3',
        flow_token: btn.flow_token ? JSON.stringify(btn.flow_token) : '{}',
        flow_id: btn.flow_id || '',
        flow_cta: btn.flow_cta || 'Open',
        flow_action: btn.flow_action || 'navigate',
        flow_action_payload: btn.flow_action_payload || {},
        flow_metadata: btn.flow_metadata || {},
        icon: btn.icon || 'sahril2nd'
      })
    }

    if (btn.type === 'booking_confirmation' || btn.booking_confirmation) {
      const p = btn.booking_confirmation || btn.params || {}
      return { name: 'booking_confirmation', buttonParamsJson: JSON.stringify(p) }
    }

    if (btn.sections || btn.rows) {
      const sections = btn.sections
        ? btn.sections.map(sec => ({
            title: sec.title || '',
            highlight_label: sec.highlight_label || undefined,
            rows: (sec.rows || []).map((row, ri) => ({
              header: row.header || undefined,
              title: row.title || row.text || '',
              description: row.description || row.desc || '',
              id: row.id || row.rowId || `row_${ri}`
            }))
          }))
        : [{
            title: btn.sectionTitle || '',
            rows: (btn.rows || []).map((row, ri) => ({
              header: row.header || undefined,
              title: row.title || row.text || '',
              description: row.description || row.desc || '',
              id: row.id || row.rowId || `row_${ri}`
            }))
          }]
      return { name: 'single_select', buttonParamsJson: JSON.stringify({ title: btn.title || btn.buttonText || 'Pilih', sections, icon: btn.icon || 'DEFAULT' }) }
    }

    if (btn.id && !btn.url && !btn.call && !btn.copy) return {
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({
        display_text: text,
        id: btn.id
      })
    }

    return {
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({
        display_text: text,
        id: btn.id || `btn_${i}`
      })
    }
  })

  const buildContextInfo = (options = {}, extra = {}) => {
    const ctx = { ...extra, ...(options.contextInfo || {}) }
    if (options.quoted) {
      const q = options.quoted
      ctx.stanzaId = q?.key?.id
      ctx.participant = q?.key?.participant || q?.key?.remoteJid
      ctx.quotedMessage = q?.message
    }
    if (options.forward || options.forwarded) {
      ctx.forwardingScore = options.forwardingScore || 1
      ctx.isForwarded = true
    }
    return ctx
  }

  const _originalSendMessage = sock.sendMessage.bind(sock)
  const _originalRelayMessage = sock.relayMessage.bind(sock)

  sock.sendRelay = async (jid, message, options = {}) => {
    if (message && typeof message === 'object' && message.type) {
      return sock.sendMessage(jid, message, options)
    }

    if (message?.imageMessage?.url && !message?.imageMessage?.directPath) {
      try {
        const m = await uploadMedia({ image: message.imageMessage.url })
        message.imageMessage = m.imageMessage
      } catch (_) {}
    }
    const extraNodes = options.additionalNodes || []
    const needsBiz = message?.interactiveMessage || message?.buttonsMessage ||
                     message?.viewOnceMessage?.message?.interactiveMessage
    const hasBiz = extraNodes.some(n => n.tag === 'biz')
    const finalNodes = (needsBiz && !hasBiz) ? [bizNode, ...extraNodes] : extraNodes
    return _originalRelayMessage(jid, message, {
      ...options,
      additionalNodes: finalNodes.length ? finalNodes : undefined
    })
  }

  sock.sendMessage = async (jid, content = {}, options = {}) => {
    if (content.buttons && Array.isArray(content.buttons)) return sock.sendButtons(jid, content, options)
    if (content.type === 'bottom_sheet')    return sock.sendButtons(jid, content, options)
    if (content.type === 'carousel' || content.carousel) return sock.sendButtons(jid, content, options)
    if (content.type === 'template')        return sock.sendButtons(jid, content, options)
    if (content.type === 'location_buttons') return sock.sendButtons(jid, content, options)
    if (content.type === 'review_and_pay')  return sock.sendButtons(jid, content, options)

    if (content.type === 'album' || content.album) {
      return sock.sendAlbum(jid, content.medias || content.album || [], options)
    }

    if (content.type === 'product') return sock.sendProduct(jid, content, options)

    if (content.type === 'product_list') return sock.sendProductList(jid, content, options)

    if (content.type === 'order') return sock.sendOrder(jid, content, options)

    if (content.type === 'poll') return sock.sendPoll(jid, content, options)

    if (content.type === 'poll_cmd') return sock.pollCmd(jid, content, options)
    
    if (content.type === 'image_poll') return sock.sendImagePoll(jid, content, options)

    if (content.type === 'poll_snapshot') return sock.sendPollSnapshot(jid, content, options)

    if (content.type === 'event') return sock.sendEvent(jid, content, options)

    if (content.type === 'booking_confirmation') return sock.sendBooking(jid, content, options)

    if (content.type === 'link_preview') return sock.sendLinkPreview(jid, content, options)

    if (content.type === 'raw') return sock.sendRawMessage(jid, content.message, options)

    if (content === sock.createAIRich) {
      const { quoted, contextInfo, title, footer, addText, addCode, addTable, addSource, addImage, addVideo, addReels, addProduct, addPost, addTip, addSuggest, ...rest } = options
      const builder = sock.createAIRich({ title, footer, contextInfo })
      if (addText)    (Array.isArray(addText)    ? addText    : [addText]).forEach(v => builder.addText(typeof v === 'string' ? v : v[0], v[1]))
      if (addCode)    (Array.isArray(addCode[0]) ? addCode    : [addCode]).forEach(v => builder.addCode(v[0], v[1]))
      if (addTable)   builder.addTable(addTable)
      if (addImage)   builder.addImage(addImage)
      if (addVideo)   builder.addVideo(addVideo)
      if (addReels)   builder.addReels(addReels)
      if (addProduct) builder.addProduct(addProduct)
      if (addPost)    builder.addPost(addPost)
      if (addSource)  builder.addSource(addSource)
      if (addTip)     (Array.isArray(addTip) ? addTip : [addTip]).forEach(v => builder.addTip(v))
      if (addSuggest) builder.addSuggest(addSuggest)
      return sock.sendAIRich(jid, builder, { quoted, ...rest })
    }
    if (content.type === 'ai_rich' || typeof content.send === 'function') return sock.sendAIRich(jid, content, options)

    if (content?.rich) {
      const r = content.rich
      const builder = sock.createAIRich({
        title: r.title || '',
        footer: r.footer || ''
      })

      const ORDER = ['text', 'code', 'table', 'image', 'video', 'reels', 'source', 'product', 'post', 'metadata', 'tip', 'widget', 'footerAction', 'suggest']

      for (const key of ORDER) {
        if (!(key in r)) continue
        const value = r[key]

        if (key === 'text')         { builder.addText(value); continue }
        if (key === 'code')         { Array.isArray(value[0]) ? value.forEach(v => builder.addCode(v[0], v[1])) : builder.addCode(value[0], value[1]); continue }
        if (key === 'table')        { builder.addTable(value); continue }
        if (key === 'image')        { builder.addImage(value); continue }
        if (key === 'video')        { builder.addVideo(value); continue }
        if (key === 'reels')        { builder.addReels(value); continue }
        if (key === 'source')       { builder.addSource(value); continue }
        if (key === 'product')      { builder.addProduct(value); continue }
        if (key === 'post')         { builder.addPost(value); continue }
        if (key === 'metadata')     { (Array.isArray(value) ? value : [value]).forEach(v => builder.addMetadata(v)); continue }
        if (key === 'tip')          { (Array.isArray(value) ? value : [value]).forEach(v => builder.addTip(v)); continue }
        if (key === 'widget')       { builder.addWidget(value); continue }
        if (key === 'footerAction') { builder.addFooterAction(value); continue }
        if (key === 'suggest')      { builder.addSuggest(value); continue }
      }

      return sock.sendAIRich(jid, builder, options)
    }
    return _originalSendMessage(jid, content, options)
  }

  sock.sendButtons = async (jid, content = {}, options = {}) => {
    const contextInfo = buildContextInfo(options, content.contextInfo || {})

    if (content.buttonsMessage || content.templateMessage || content.listMessage || content.productMessage || content.carouselMessage || content.interactiveMessage) {
      return _originalSendMessage(jid, content, options)
    }

    if (content.type === 'bottom_sheet') {
      const header = await buildHeader(content)
      const buttons = convertButtons(content.buttons || [])
      const msg = buildMsg(jid, {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.create({
              header: {
                title: content.title || '',
                subtitle: content.subtitle || '',
                hasMediaAttachment: header.hasMediaAttachment || false,
                ...(header.imageMessage    && { imageMessage: header.imageMessage }),
                ...(header.videoMessage    && { videoMessage: header.videoMessage }),
                ...(header.documentMessage && { documentMessage: header.documentMessage })
              },
              body: { text: content.text || '' },
              footer: { text: content.footer || '' },
              contextInfo,
              nativeFlowMessage: {
                buttons,
                messageParamsJson: JSON.stringify({ is_bottom_sheet_mode: true, ...(content.messageParams || {}) })
              }
            })
          }
        }
      }, options)
      return sock.sendRelay(jid, msg.message, {
        messageId: msg.key.id,
        additionalNodes: [bizNode, ...(options.additionalNodes || [])]
      })
    }

    if (content.type === 'carousel' || content.carousel) {
      const cardsData = content.carousel || content.cards || []
      const cards = await Promise.all(cardsData.map(async card => {
        const mediaHeader = await buildHeader(card)
        return {
          header: {
            title: card.title || '',
            hasMediaAttachment: mediaHeader.hasMediaAttachment || false,
            ...(mediaHeader.imageMessage && { imageMessage: mediaHeader.imageMessage }),
            ...(mediaHeader.videoMessage && { videoMessage: mediaHeader.videoMessage })
          },
          body: { text: card.body || card.text || '' },
          footer: { text: card.footer || content.footer || '' },
          nativeFlowMessage: { buttons: convertButtons(card.buttons || []), messageParamsJson: '' }
        }
      }))
      const msg = buildMsg(jid, {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: { text: content.text || '' },
              footer: { text: content.footer || '' },
              contextInfo,
              carouselMessage: { cards }
            })
          }
        }
      }, options)
      return sock.sendRelay(jid, msg.message, {
        messageId: msg.key.id,
        additionalNodes: [bizNode, ...(options.additionalNodes || [])]
      })
    }

    if (content.type === 'template') {
      const hydratedButtons = (content.buttons || []).map(btn => {
        if (btn.url)  return { urlButton: { displayText: btn.displayText || btn.text, merchantUrl: btn.url } }
        if (btn.call) return { callButton: { displayText: btn.displayText || btn.text, phoneNumber: btn.call } }
        return { quickReplyButton: { displayText: btn.displayText || btn.text, id: btn.id || btn.text } }
      })
      const msg = buildMsg(jid, {
        templateMessage: {
          hydratedTemplate: {
            hydratedContentText: content.text || '',
            hydratedFooterText: content.footer || '',
            hydratedTitleText: content.title || '',
            hydratedButtons,
            contextInfo
          }
        }
      }, options)
      return sock.sendRelay(jid, msg.message, {
        messageId: msg.key.id,
        additionalNodes: [bizNode, ...(options.additionalNodes || [])]
      })
    }

    if (content.type === 'location_buttons') {
      let jpegThumbnail = content.jpegThumbnail || Buffer.from([])
      if (content.thumbnail) {
        if (typeof content.thumbnail === 'string' && content.thumbnail.startsWith('http')) {
          const res = await fetch(content.thumbnail)
          const buff = Buffer.from(await res.arrayBuffer())
          const sharp = (await import('sharp')).default
          jpegThumbnail = await sharp(buff).resize(300, 300, { fit: 'cover' }).jpeg().toBuffer()
        } else if (Buffer.isBuffer(content.thumbnail)) {
          jpegThumbnail = content.thumbnail
        }
      }

      const rawButtons = (content.buttons || []).map((btn, i) => {
        const text = btn.displayText || btn.text || ''
        const base = {
          buttonId: btn.id || btn.buttonId || `btn_${i}`,
          buttonText: { displayText: text },
          type: 1
        }

        if (btn.sections || btn.rows) {
          const sections = btn.sections
            ? btn.sections.map(sec => ({
                title: sec.title || '',
                highlight_label: sec.highlight_label || '',
                rows: (sec.rows || []).map((row, ri) => ({
                  header: row.header || '',
                  title: row.title || row.text || '',
                  description: row.description || row.desc || '',
                  id: row.id || row.rowId || `row_${ri}`
                }))
              }))
            : [{
                title: btn.sectionTitle || '',
                rows: (btn.rows || []).map((row, ri) => ({
                  header: row.header || '',
                  title: row.title || row.text || '',
                  description: row.description || row.desc || '',
                  id: row.id || row.rowId || `row_${ri}`
                }))
              }]
          base.nativeFlowInfo = {
            name: 'single_select',
            paramsJson: JSON.stringify({ title: btn.title || btn.buttonText || 'Pilih', sections })
          }
        }

        if (btn.url) base.nativeFlowInfo = {
          name: 'cta_url',
          paramsJson: JSON.stringify({
            display_text: text,
            url: btn.url
           })
          }
        if (btn.copy || btn.copyCode) base.nativeFlowInfo = {
          name: 'cta_copy',
          paramsJson: JSON.stringify({
            display_text: text,
            copy_code: btn.copy || btn.copyCode
            })
           }
        if (btn.call || btn.phone) base.nativeFlowInfo = { name: 'cta_call', paramsJson: JSON.stringify({ display_text: text, phone_number: btn.call || btn.phone }) }
        return base
      })

      const msg = buildMsg(jid, {
        buttonsMessage: {
          locationMessage: {
            degreesLatitude: content.lat || 0,
            degreesLongitude: content.lng || 0,
            jpegThumbnail
          },
          contentText: content.text || '',
          footerText: content.footer || '',
          buttons: rawButtons,
          headerType: 6,
          contextInfo
        }
      }, options)

      return sock.sendRelay(jid, msg.message, {
        messageId: msg.key.id,
        additionalNodes: [bizNode, ...(options.additionalNodes || [])]
      })
    }

    if (content.type === 'review_and_pay') {
      const { generateWAMessageContent } = await import('@whiskeysockets/baileys')

      let imageMessage
      if (content.image) {
        const media = await generateWAMessageContent(
          { image: content.image },
          { upload: sock.waUploadToServer }
        )
        imageMessage = media.imageMessage
      }

      const payParams = {
        currency: content.paymentParams?.currency || 'IDR',
        payment_type: '',
        payment_configuration: '',
        transaction_id: '',
        total_amount: content.paymentParams?.total_amount || { value: 0, offset: 100 },
        reference_id: content.paymentParams?.reference_id || `REF-${Date.now()}`,
        order_request_id: content.paymentParams?.order_request_id || crypto.randomUUID(),
        type: content.paymentParams?.type || 'digital-goods',
        payment_method: '',
        payment_status: 'captured',
        payment_timestamp: Math.floor(Date.now() / 1000),
        order: content.paymentParams?.order || {},
        additional_note: content.paymentParams?.additional_note || '',
        native_payment_methods: [JSON.stringify({ name: 'PIX', enabled: false })],
        share_payment_status: true,
        is_soft_deleted: false
      }

      return sock.sendRelay(jid, {
        interactiveMessage: {
          header: {
            title: content.title || '',
            subtitle: content.subtitle || '',
            hasMediaAttachment: !!imageMessage,
            ...(imageMessage && { imageMessage })
          },
          body: { text: content.text || '' },
          footer: { text: content.footer || '' },
          nativeFlowMessage: {
            buttons: [{
              name: 'review_and_pay',
              buttonParamsJson: JSON.stringify(payParams)
            }]
          }
        }
      }, {
        additionalNodes: [
          { tag: 'biz', attrs: { native_flow_name: 'order_details' } },
          ...(options.additionalNodes || [])
        ]
      })
    }

    const header = await buildHeader(content)
    const buttons = convertButtons(content.buttons || [])
    const messageParamsJson = content.messageParams ? JSON.stringify(content.messageParams) : ''
    const msgDef = buildMsg(jid, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            header: {
              title: content.title || '',
              subtitle: content.subtitle || '',
              hasMediaAttachment: header.hasMediaAttachment || false,
              ...(header.imageMessage    && { imageMessage: header.imageMessage }),
              ...(header.videoMessage    && { videoMessage: header.videoMessage }),
              ...(header.documentMessage && { documentMessage: header.documentMessage }),
              ...(header.locationMessage && { locationMessage: header.locationMessage })
            },
            body: { text: content.text || '' },
            footer: { text: content.footer || '' },
            contextInfo,
            nativeFlowMessage: { buttons, messageParamsJson }
          })
        }
      }
    }, options)
    return sock.sendRelay(jid, msgDef.message, {
      messageId: msgDef.key.id,
      additionalNodes: [bizNode, ...(options.additionalNodes || [])]
    })
  }

  sock.sendList = async (jid, content = {}, options = {}) => {
    const contextInfo = buildContextInfo(options, content.contextInfo || {})
    return sock.sendMessage(jid, {
      listMessage: {
        title: content.title || '',
        description: content.text || '',
        buttonText: content.buttonText || 'Pilih',
        footerText: content.footer || '',
        listType: content.listType || 1,
        sections: content.sections || [],
        contextInfo
      }
    }, options)
  }

  sock.sendTemplate = async (jid, content = {}, options = {}) =>
    sock.sendButtons(jid, { ...content, type: 'template' }, options)

  sock.sendLocationButtons = async (jid, content = {}, options = {}) =>
    sock.sendButtons(jid, { ...content, type: 'location_buttons' }, options)

  sock.sendProduct = async (jid, content = {}, options = {}) => {
    const contextInfo = buildContextInfo(options, content.contextInfo || {})
    let productImage
    if (content.image) {
      const m = await uploadMedia({ image: content.image })
      productImage = m.imageMessage
    }

    if (content.buttons && content.buttons.length > 0) {
      const buttons = convertButtons(content.buttons)
      const msgProd = buildMsg(jid, {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.create({
              header: {
                title: content.title || '',
                hasMediaAttachment: true,
                productMessage: {
                  product: {
                    productImage,
                    productId: content.productId || '',
                    title: content.title || '',
                    description: content.description || '',
                    currencyCode: content.currency || 'IDR',
                    priceAmount1000: (content.price || 0) * 1000,
                    retailerId: content.retailerId || '',
                    url: content.url || '',
                    productImageCount: 1
                  },
                  businessOwnerJid: content.businessJid || sock.user?.id
                }
              },
              body: { text: content.text || content.description || '' },
              footer: { text: content.footer || '' },
              contextInfo,
              nativeFlowMessage: { buttons, messageParamsJson: '' }
            })
          }
        }
      }, options)
      return sock.sendRelay(jid, msgProd.message, {
        messageId: msgProd.key.id,
        additionalNodes: [bizNode, ...(options.additionalNodes || [])]
      })
    }

    const msgProdBare = buildMsg(jid, {
      productMessage: {
        product: {
          productImage,
          productId: content.productId || '',
          title: content.title || '',
          description: content.description || '',
          currencyCode: content.currency || 'IDR',
          priceAmount1000: (content.price || 0) * 1000,
          retailerId: content.retailerId || '',
          url: content.url || '',
          productImageCount: 1
        },
        businessOwnerJid: content.businessJid || sock.user?.id,
        ...((content.text || content.caption) && { body: content.text || content.caption }),
        ...(content.footer && { footer: content.footer }),
        contextInfo
      }
    }, options)
    return sock.sendRelay(jid, msgProdBare.message, {
      messageId: msgProdBare.key.id,
      additionalNodes: [bizNode, ...(options.additionalNodes || [])]
    })
  }

  sock.sendProductList = async (jid, content = {}, options = {}) => {
    const contextInfo = buildContextInfo(options, content.contextInfo || {})

    const toBuffer = async (src) => {
      if (!src) return null
      if (Buffer.isBuffer(src)) return src
      if (typeof src === 'string' && /^https?:\/\//.test(src)) {
        const res = await fetch(src)
        return Buffer.from(await res.arrayBuffer())
      }
      if (typeof src === 'string') return Buffer.from(src, 'base64')
      if (src.url) return toBuffer(src.url)
      return null
    }

    let jpegThumbnail = content.jpegThumbnail
    const rawThumb = await toBuffer(content.thumbnail || content.image)
    if (rawThumb) {
      try {
        const sharp = (await import('sharp')).default
        jpegThumbnail = await sharp(rawThumb)
          .resize(300, 300, { fit: 'cover' })
          .jpeg({ quality: 70 })
          .toBuffer()
      } catch (_) {
        jpegThumbnail = rawThumb
      }
    }

    const normProduct = (p) => ({
      productId: String(typeof p === 'object' ? (p.productId ?? p.id ?? '0') : p)
    })

    const productSections = content.sections
      ? content.sections.map(sec => ({
          title: sec.title || '',
          products: (sec.products || []).map(normProduct)
        }))
      : [{
          title: content.sectionTitle || 'Menu Utama',
          products: (content.products || ['0']).map(normProduct)
        }]

    return sock.sendRelay(jid, {
      listMessage: {
        title: content.title || '',
        description: content.text || content.description || '',
        buttonText: content.buttonText || 'Lihat Produk',
        listType: content.listType || 2,
        productListInfo: {
          headerImage: {
            ...(jpegThumbnail && { jpegThumbnail }),
            productId: String(content.headerProductId || content.productId || '0')
          },
          productSections,
          businessOwnerJid: content.businessJid || sock.user?.id
        },
        footerText: content.footer || '',
        contextInfo
      }
    }, {
      additionalNodes: [
        {
          tag: 'biz',
          attrs: {},
          content: [{
            tag: 'list',
            attrs: { v: '2', type: 'product_list' }
          }]
        },
        ...(options.additionalNodes || [])
      ]
    })
  }

  sock.sendOrder = async (jid, content = {}, options = {}) => {
    const contextInfo = buildContextInfo(options, content.contextInfo || {})
    return sock.sendMessage(jid, {
      orderMessage: {
        orderId: content.orderId || `ORDER-${Date.now()}`,
        thumbnail: content.thumbnail || '',
        itemCount: content.itemCount || 1,
        status: content.status || 1,
        surface: content.surface || 1,
        message: content.text || '',
        orderTitle: content.title || '',
        sellerJid: content.sellerJid || sock.user?.id,
        token: content.token || 'token',
        totalAmount1000: (content.total || 0) * 1000,
        totalCurrencyCode: content.currency || 'IDR',
        contextInfo
      }
    }, { ...options, additionalNodes: [bizNode, ...(options.additionalNodes || [])] })
  }
  
  sock.pollCmd = async (jid, content = {}, options = {}) => {
    const opts = content.options || []
    if (!Array.isArray(opts) || opts.length < 1) {
      throw new Error('pollCmd: minimal 1 opsi, format [{ option, command }]')
    }

    const sent = await sock.sendPoll(jid, {
      title: content.title || content.name || '',
      options: opts.map(o => o.option),
      selectableCount: content.selectableCount ?? 1
    }, options)

    const pollId = sent?.key?.id
    if (!pollId) throw new Error('pollCmd: gagal mengirim poll')

    if (sock.saveMessageToStore) sock.saveMessageToStore(sent)

    const mapped = {}
    for (const o of opts) {
      if (!o.option || !o.command) continue
      mapped[o.option] = o.command.replace(/^\s*[^a-zA-Z0-9]*\s*/, '') // strip prefix jika ikut disertakan
    }

    (sock.db?.getPollCommands || getPollCommands)()[pollId] = {
      chat: jid,
      options: mapped,
      expireAt: Date.now() + (content.time || 10 * 60 * 1000)
    }

    return sent
  }

  sock.sendPoll = async (jid, content = {}, options = {}) => {
    const contextInfo = buildContextInfo(options, content.contextInfo || {})
    return sock.sendMessage(jid, {
      poll: {
        name: content.title || content.name || content.text || '',
        values: content.options || content.values || [],
        selectableCount: content.selectableCount ?? 1
      },
      contextInfo
    }, options)
  }

  sock.sendPollSnapshot = async (jid, content = {}, options = {}) => {
    const contextInfo = buildContextInfo(options, content.contextInfo || {})

    return sock.sendRelay(jid, {
      messageContextInfo: {
        messageSecret: content.messageSecret || '0tiVDFYxl/DrRad4ll69oDBPirQIC96PT/TSqJEkfQ4='
      },
      pollResultSnapshotMessage: {
        name: content.name || content.title || '',
        pollVotes: (content.pollVotes || []).map(v => ({
          optionName: v.optionName || v.name || '',
          optionVoteCount: String(v.optionVoteCount ?? v.count ?? 0)
        })),
        contextInfo,
        pollType: content.pollType || 'POLL'
      }
    }, {
      ...(options.additionalNodes && { additionalNodes: options.additionalNodes })
    })
  }

  sock.sendImagePoll = async (jid, content = {}, options = {}) => {
    const items = content.options || content.values || content.images || []
    if (!Array.isArray(items) || items.length < 2) {
      throw new Error('sendImagePoll: minimal 2 opsi, format [{ name, image }]')
    }

    const messageSecret = crypto.randomBytes(32)

    const hashOpt = (name, sha) =>
      crypto
        .createHash('sha256')
        .update(
          crypto.createHash('sha256').update(String(name)).digest('hex') +
            (sha ? Buffer.from(sha).toString('base64') : '')
        )
        .digest('hex')

    const images = await Promise.all(
      items.map(async (item, index) => {
        if (!item?.image) throw new Error(`sendImagePoll: opsi index ${index} belum ada image`)
        const name = String(item.name ?? item.title ?? `Opsi ${index + 1}`)
        const { imageMessage } = await prepareWAMessageMedia(
          { image: item.image },
          { upload: sock.waUploadToServer }
        )
        if (!imageMessage?.fileSha256) {
          throw new Error(`sendImagePoll: imageMessage gagal dibuat pada index ${index}`)
        }
        return { index, name, imageMessage, optionHash: hashOpt(name, imageMessage.fileSha256) }
      })
    )

    const parent = buildMsg(jid, {
      pollCreationMessageV3: {
        name: content.name || content.title || content.text || 'Pilih gambar favorit',
        selectableOptionsCount: content.selectableCount ?? 1,
        options: images.map(({ name, optionHash }) => ({ optionName: name, optionHash })),
        pollContentType: proto.Message.PollContentType.IMAGE
      },
      messageContextInfo: { messageSecret }
    }, options)

    const parentKey = parent.key

    await sock.sendRelay(jid, parent.message, {
      messageId: parentKey.id,
      additionalNodes: [
        { tag: 'meta', attrs: { polltype: 'creation', contenttype: 'image' } },
        ...(options.additionalNodes || [])
      ]
    })

    for (const { imageMessage } of images) {
      const child = proto.Message.create({
        messageContextInfo: {
          messageAssociation: {
            parentMessageKey: parentKey,
            associationType: proto.MessageAssociation.AssociationType.MEDIA_POLL
          }
        },
        pollCreationOptionImageMessage: {
          message: { imageMessage }
        }
      })

      await sock.sendRelay(jid, child, {
        messageId: crypto.randomUUID(),
        additionalNodes: [
          { tag: 'meta', attrs: { message_association_type: 'media_poll' } }
        ]
      })
    }

    return parent
  }

  sock.sendAlbum = async (jid, medias = [], options = {}) => {
    const album = await generateWAMessage(jid, { text: options.text || '' }, {
      userJid: sock.user?.id,
      quoted: options.quoted
    })
    await sock.sendRelay(jid, album.message, { messageId: album.key.id })
    for (const media of medias) {
      const content = media.image ? { image: media.image, caption: media.caption || '' }
                    : media.video ? { video: media.video, caption: media.caption || '' }
                    : null
      if (!content) continue
      const m = await generateWAMessage(jid, content, {
        userJid: sock.user?.id,
        upload: sock.waUploadToServer
      })
      m.message.messageContextInfo = {
        messageAssociation: {
          associationType: 1,
          parentMessageKey: album.key
        }
      }
      await sock.sendRelay(jid, m.message, { messageId: m.key.id })
    }
    return album
  }

  sock.sendLinkPreview = async (jid, content = {}, options = {}) => {
    const contextInfo = buildContextInfo(options, content.contextInfo || {})
    let jpegThumbnail = ''
    let thumbnailDirectPath, thumbnailSha256, thumbnailEncSha256, mediaKey, mediaKeyTimestamp
    let thumbnailHeight = content.thumbnailHeight || 1280
    let thumbnailWidth  = content.thumbnailWidth  || 768

    if (content.thumbnail) {
      let buff
      if (Buffer.isBuffer(content.thumbnail)) {
        buff = content.thumbnail
      } else if (typeof content.thumbnail === 'string' && content.thumbnail.startsWith('http')) {
        const res = await fetch(content.thumbnail)
        buff = Buffer.from(await res.arrayBuffer())
      } else {
        buff = Buffer.from(content.thumbnail, 'base64')
      }

      const sharp = (await import('sharp')).default
      const meta = await sharp(buff).metadata()
      thumbnailHeight = meta.height || thumbnailHeight
      thumbnailWidth  = meta.width  || thumbnailWidth
      const resized = await sharp(buff).resize(200, 200, { fit: 'cover' }).jpeg({ quality: 60 }).toBuffer()
      jpegThumbnail = resized.toString('base64')

      if (content.uploadHD !== false) {
        try {
          const media = await prepareWAMessageMedia(
            { image: buff },
            { upload: sock.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }
          )
          thumbnailDirectPath   = media.imageMessage?.directPath
          thumbnailSha256       = media.imageMessage?.fileSha256
          thumbnailEncSha256    = media.imageMessage?.fileEncSha256
          mediaKey              = media.imageMessage?.mediaKey
          mediaKeyTimestamp     = media.imageMessage?.mediaKeyTimestamp
        } catch (_) {}
      }
    }

    return sock.sendRelay(jid, {
      extendedTextMessage: {
        text: content.text || content.url || '',
        matchedText: content.url || '',
        canonicalUrl: content.url || '',
        title: content.title || '',
        description: content.description || '',
        previewType: content.previewType ?? 0,
        mediaType: content.mediaType ?? 1,
        jpegThumbnail,
        ...(thumbnailDirectPath && { thumbnailDirectPath }),
        ...(thumbnailSha256     && { thumbnailSha256 }),
        ...(thumbnailEncSha256  && { thumbnailEncSha256 }),
        ...(mediaKey            && { mediaKey }),
        ...(mediaKeyTimestamp   && { mediaKeyTimestamp }),
        thumbnailHeight,
        thumbnailWidth,
        inviteLinkGroupTypeV2: content.inviteLinkGroupTypeV2 || 'DEFAULT',
        contextInfo
      }
    }, {})
  }

  sock.sendEvent = async (jid, content = {}, options = {}) => {
    const startTime = content.startTime
      ? Math.floor(new Date(content.startTime).getTime() / 1000)
      : Math.floor(Date.now() / 1000)

    return sock.sendRelay(jid, {
      messageContextInfo: {
        messageSecret: content.messageSecret || 'ptz3I2WYmmosIUCYwP7vaPyNLHhZtbEyFA64NyaU3Ok=',
        limitSharingV2: {
          sharingLimited: false,
          trigger: 'CHAT_SETTING',
          limitSharingSettingTimestamp: String(Date.now()),
          initiatedByMe: false
        }
      },
      eventMessage: {
        isCanceled: false,
        name: content.name || content.title || '',
        startTime: String(startTime),
        extraGuestsAllowed: content.extraGuestsAllowed ?? false,
        isScheduleCall: content.isScheduleCall ?? false,
        hasReminder: content.hasReminder ?? true,
        reminderOffsetSec: String(content.reminderOffsetSec || 3600)
      }
    }, {
      additionalNodes: [
        { tag: 'meta', attrs: { event_type: 'creation' } },
        ...(options.additionalNodes || [])
      ]
    })
  }

  sock.createEvent = (options = {}) => {
    const builder = {
      _title: options.title || '',
      _startTime: options.startTime || null,
      _hasReminder: options.hasReminder ?? true,
      _reminderOffsetSec: options.reminderOffsetSec || 3600,
      _extraGuestsAllowed: options.extraGuestsAllowed ?? false,
      _isScheduleCall: options.isScheduleCall ?? false,
      _messageSecret: options.messageSecret || 'ptz3I2WYmmosIUCYwP7vaPyNLHhZtbEyFA64NyaU3Ok=',
      _buttons: [],
      _footer: options.footer || '',
      _quoted: options.quoted || null,

      setTitle(title) { this._title = title; return this },
      setStartTime(t) { this._startTime = t; return this },
      setReminder(sec) { this._reminderOffsetSec = sec; return this },
      setFooter(footer) { this._footer = footer; return this },
      setQuoted(q) { this._quoted = q; return this },

      addButton(name, params = {}) {
        this._buttons.push({ name, buttonParamsJson: JSON.stringify(params) })
        return this
      },

      async send(jid, opts = {}) {
        const startTime = this._startTime
          ? Math.floor(new Date(this._startTime).getTime() / 1000)
          : Math.floor(Date.now() / 1000)

        const quoted = this._quoted || opts.quoted

        if (this._buttons.length > 0) {
          const contextInfo = buildContextInfo({ quoted, ...(opts.contextInfo || {}) })
          const msgEv = buildMsg(jid, {
            viewOnceMessage: {
              message: {
                interactiveMessage: proto.Message.InteractiveMessage.create({
                  header: { title: this._title, hasMediaAttachment: false },
                  body: { text: '' },
                  footer: { text: this._footer },
                  contextInfo,
                  nativeFlowMessage: { buttons: this._buttons, messageParamsJson: '' }
                })
              }
            }
          }, { quoted })
          return sock.sendRelay(jid, msgEv.message, {
            messageId: msgEv.key.id,
            additionalNodes: [
              bizNode,
              { tag: 'meta', attrs: { event_type: 'creation' } },
              ...(opts.additionalNodes || [])
            ]
          })
        }

        return sock.sendRelay(jid, {
          messageContextInfo: {
            messageSecret: this._messageSecret,
            limitSharingV2: {
              sharingLimited: false,
              trigger: 'CHAT_SETTING',
              limitSharingSettingTimestamp: String(Date.now()),
              initiatedByMe: false
            }
          },
          eventMessage: {
            isCanceled: false,
            name: this._title,
            startTime: String(startTime),
            extraGuestsAllowed: this._extraGuestsAllowed,
            isScheduleCall: this._isScheduleCall,
            hasReminder: this._hasReminder,
            reminderOffsetSec: String(this._reminderOffsetSec)
          }
        }, {
          additionalNodes: [
            { tag: 'meta', attrs: { event_type: 'creation' } },
            ...(opts.additionalNodes || [])
          ]
        })
      }
    }
    return builder
  }

  sock.sendBooking = async (jid, content = {}, options = {}) => {
    const contextInfo = buildContextInfo(options, content.contextInfo || {})
    const params = {
      start_datetime: content.start_datetime || '',
      end_datetime: content.end_datetime || '',
      location: content.location || '',
      booking_url: content.booking_url || '',
      phone_number: content.phone_number || '',
      booking_management_url: content.booking_management_url || '',
      description: content.description || '',
      email: content.email || '',
      display_text: content.display_text || 'Book Now',
      display_content: content.display_content || {}
    }
    const msg = buildMsg(jid, {
      interactiveMessage: proto.Message.InteractiveMessage.create({
        header: { title: content.title || '', hasMediaAttachment: false },
        body: { text: content.text || '' },
        footer: { text: content.footer || '' },
        contextInfo,
        nativeFlowMessage: {
          buttons: [{ name: 'booking_confirmation', buttonParamsJson: JSON.stringify(params) }],
          messageParamsJson: ''
        }
      })
    }, options)
    return sock.sendRelay(jid, msg.message, {
      messageId: msg.key.id,
      additionalNodes: [bizNode, ...(options.additionalNodes || [])]
    })
  }

  sock.sendRawMessage = async (jid, message, options = {}) => {
    const contextInfo = buildContextInfo(options)
    const keys = Object.keys(message)
    if (keys.length && (options.quoted || options.forward)) {
      const firstKey = keys[0]
      if (message[firstKey] && typeof message[firstKey] === 'object') {
        message[firstKey].contextInfo = {
          ...(message[firstKey].contextInfo || {}),
          ...contextInfo
        }
      }
    }
    const msg = buildMsg(jid, message, options)
    const extraNodes = options.additionalNodes || []
    const needsBiz = message?.interactiveMessage || message?.buttonsMessage ||
                     message?.viewOnceMessage?.message?.interactiveMessage
    const hasBiz = extraNodes.some(n => n.tag === 'biz')
    const finalNodes = (needsBiz && !hasBiz) ? [bizNode, ...extraNodes] : extraNodes

    return sock.sendRelay(jid, msg.message, {
      messageId: msg.key.id,
      additionalNodes: finalNodes.length ? finalNodes : undefined
    })
  }

  return sock
}

export { makeButtonsHelper };