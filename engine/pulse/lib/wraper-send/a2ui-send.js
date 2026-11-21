"use strict";

import crypto from "crypto";
import { generateWAMessageFromContent } from "@whiskeysockets/baileys";

class A2UI {
  constructor({ catalogId = "https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json", version = "v0.9" } = {}) {
    this._version = version;
    this._catalogId = catalogId;
    this._components = new Map();
    this._counter = 0;
    this._rootChildren = [];
    this._listCardPayload = null;
  }

  #nextId(prefix) {
    return `${prefix}_${(this._counter++).toString(36)}`;
  }

  #reg(id, component, extra = {}) {
    id ??= this.#nextId(component.toLowerCase());
    if (this._components.has(id)) throw new Error(`Component id "${id}" already used`);
    this._components.set(id, { id, component, ...extra });
    return id;
  }

  text(text, { id, variant = "caption" } = {}) {
    return this.#reg(id, "Text", { text, variant });
  }

  image(url, { id, variant = "header", fit = "cover" } = {}) {
    return this.#reg(id, "Image", { url, variant, fit });
  }

  video(url, { id } = {}) {
    return this.#reg(id, "Video", { url });
  }

  checkbox(label, { id, value = false } = {}) {
    return this.#reg(id, "CheckBox", { label, value });
  }

  textField(label, { id, variant = "text" } = {}) {
    return this.#reg(id, "TextField", { label, variant });
  }

  button(childId, { id, variant = "primary", action } = {}) {
    if (!childId) throw new TypeError("button(childId) requires the id of a child component");
    return this.#reg(id, "Button", { child: childId, variant, ...(action ? { action } : {}) });
  }

  card(childId, { id } = {}) {
    return this.#reg(id, "Card", { child: childId });
  }

  column(children = [], { id, justify, align } = {}) {
    if (!children.length) throw new TypeError("column(children) requires at least one child id");
    return this.#reg(id, "Column", { children, ...(justify ? { justify } : {}), ...(align ? { align } : {}) });
  }

  row(children = [], { id } = {}) {
    if (!children.length) throw new TypeError("row(children) requires at least one child id");
    return this.#reg(id, "Row", { children });
  }

  divider({ id } = {}) {
    return this.#reg(id, "Divider", {});
  }

  choicePicker(label, options, { id, variant = "mutuallyExclusive", value, displayStyle = "checkbox", filterable = false } = {}) {
    if (!Array.isArray(options) || !options.length) {
      throw new TypeError("choicePicker(label, options) requires a non-empty options array of {label, value}");
    }
    return this.#reg(id, "ChoicePicker", {
      label,
      variant,
      ...(value !== undefined ? { value } : {}),
      options,
      displayStyle,
      filterable,
    });
  }

  root(children) {
    if (!Array.isArray(children) || !children.length) {
      throw new TypeError("root(children) requires a non-empty array of top-level component ids");
    }
    this._rootChildren = children;
    return this;
  }

  listCard({ title, items, fallbackText, uuid = crypto.randomUUID() } = {}) {
    if (!title) throw new TypeError("listCard requires a title");
    if (!Array.isArray(items) || !items.length) {
      throw new TypeError("listCard requires a non-empty items array");
    }

    this._listCardPayload = {
      uuid,
      data: JSON.stringify({
        type: "list_card",
        title,
        fallback_text: fallbackText ?? "",
        items: items.map((item) => ({
          asset_id: item.assetId ?? crypto.randomUUID().replace(/-/g, "").slice(0, 17),
          asset_type: item.assetType ?? "PRODUCT_ITEM",
          title: item.title,
          trailing_label: item.price ?? item.trailingLabel ?? "",
          trailing_emphasis: item.emphasis ?? "strong",
        })),
      }),
      type: "im_a2ui",
      fallback: fallbackText ?? "",
    };
    return this;
  }

  build({ uuid = crypto.randomUUID(), surfaceId, type = "im_a2ui", wrapped = true } = {}) {
    if (this._listCardPayload) return this._listCardPayload;
    if (!this._rootChildren.length) throw new Error("Call root([...ids]) before build()");

    const root = { id: "root", component: "Column", children: this._rootChildren };
    const components = [root, ...this._components.values()];
    const data = wrapped
      ? {
          version: this._version,
          createSurface: {
            surfaceId: surfaceId ?? `starcore-widget=${uuid}`,
            catalogId: this._catalogId,
            components,
          },
        }
      : { components };

    return { uuid, data: JSON.stringify(data), type };
  }
}

function convertA2UIButtons(buttons = []) {
  const converted = buttons.map((btn, i) => {
    if (btn.name && btn.buttonParamsJson !== undefined) {
      return {
        name: btn.name,
        buttonParamsJson: typeof btn.buttonParamsJson === "string"
          ? btn.buttonParamsJson
          : JSON.stringify(btn.buttonParamsJson ?? {})
      };
    }

    if (btn.name) {
      return {
        name: btn.name,
        buttonParamsJson: typeof btn.params === "string"
          ? btn.params
          : JSON.stringify(btn.params ?? {})
      };
    }

    const text = btn.displayText ?? btn.text ?? btn.title ?? "";

    if (btn.url) return {
      name: "cta_url",
      buttonParamsJson: JSON.stringify({ display_text: text, url: btn.url })
    };

    if (btn.copy || btn.copyCode) return {
      name: "cta_copy",
      buttonParamsJson: JSON.stringify({
        display_text: text,
        copy_code: btn.copy || btn.copyCode
      })
    };

    if (btn.call || btn.phone) return {
      name: "cta_call",
      buttonParamsJson: JSON.stringify({
        display_text: text,
        phone_number: btn.call || btn.phone
      })
    };

    if (btn.type === "reminder" || btn.reminder) return {
      name: "cta_reminder",
      buttonParamsJson: JSON.stringify({ display_text: text })
    };

    if (btn.type === "send_location" || btn.type === "location") return {
      name: "send_location",
      buttonParamsJson: JSON.stringify({})
    };

    if (btn.type === "address") return {
      name: "address_message",
      buttonParamsJson: JSON.stringify({ display_text: text })
    };

    if (btn.transaction_id || btn.type === "payment_transaction") return {
      name: "wa_payment_transaction_details",
      buttonParamsJson: JSON.stringify({
        transaction_id: btn.transaction_id || ""
      })
    };

    if (btn.type === "review_and_pay" || btn.review_and_pay) return {
      name: "review_and_pay",
      buttonParamsJson: JSON.stringify(btn.review_and_pay || btn.params || {})
    };

    if (btn.product_id || btn.type === "mpm") return {
      name: "mpm",
      buttonParamsJson: JSON.stringify({ product_id: btn.product_id || "" })
    };

    if (btn.catalog_product_id || btn.type === "catalog") return {
      name: "automated_greeting_message_view_catalog",
      buttonParamsJson: JSON.stringify({
        business_phone_number: btn.business_phone_number || "",
        catalog_product_id: btn.catalog_product_id || ""
      })
    };

    if (btn.type === "catalog_message" || btn.thumbnail_product_retailer_id) return {
      name: "catalog_message",
      buttonParamsJson: JSON.stringify({
        thumbnail_product_retailer_id:
          btn.thumbnail_product_retailer_id || btn.retailerId || ""
      })
    };

    if (btn.flow_id || btn.galaxy_message || btn.type === "galaxy") return {
      name: "galaxy_message",
      buttonParamsJson: JSON.stringify({
        flow_message_version: btn.flow_message_version || "3",
        flow_token: btn.flow_token ? JSON.stringify(btn.flow_token) : "{}",
        flow_id: btn.flow_id || "",
        flow_cta: btn.flow_cta || "Open",
        flow_action: btn.flow_action || "navigate",
        flow_action_payload: btn.flow_action_payload || {},
        flow_metadata: btn.flow_metadata || {},
        icon: btn.icon || "sahril2nd"
      })
    };

    if (btn.type === "booking_confirmation" || btn.booking_confirmation) return {
      name: "booking_confirmation",
      buttonParamsJson: JSON.stringify(btn.booking_confirmation || btn.params || {})
    };

    if (btn.sections || btn.rows) {
      const sections = btn.sections
        ? btn.sections.map(section => ({
            title: section.title || "",
            ...(section.highlight_label
              ? { highlight_label: section.highlight_label }
              : {}),
            rows: (section.rows || []).map((row, ri) => ({
              ...(row.header ? { header: row.header } : {}),
              title: row.title || row.text || "",
              description: row.description || row.desc || "",
              id: row.id || row.rowId || `row_${ri}`
            }))
          }))
        : [{
            title: btn.sectionTitle || "",
            rows: (btn.rows || []).map((row, ri) => ({
              ...(row.header ? { header: row.header } : {}),
              title: row.title || row.text || "",
              description: row.description || row.desc || "",
              id: row.id || row.rowId || `row_${ri}`
            }))
          }];

      return {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: btn.title || btn.buttonText || "Pilih",
          sections,
          icon: btn.icon || "DEFAULT"
        })
      };
    }

    return {
      name: "quick_reply",
      buttonParamsJson: JSON.stringify({
        display_text: text || btn.buttonText || "",
        id: btn.id || btn.buttonId || `btn_${i}`
      })
    };
  });

  if (converted.length && Object.keys(converted[0]).length > 0) {
    converted.unshift({});
  }

  return converted;
}

async function sendA2UIWidget(sock, jid, {
  a2ui,
  bodyText = "",
  footer = "",
  buttons = [],
  contextInfo = {},
  expiration,
  quoted,
  type = "im_a2ui",
  wrapped = true,
} = {}) {
  if (!sock) throw new Error("Socket is required");
  if (!(a2ui instanceof A2UI)) throw new TypeError("a2ui must be an A2UI instance");

  const nativeFlowMessage = {
    buttons: convertA2UIButtons(buttons),
    messageParamsJson: JSON.stringify({ v: "1" }),
    messageVersion: 1,
  };

  const interactiveMessage = {
    header: { hasMediaAttachment: false },
    body: { text: bodyText ?? "" },
    footer: { text: footer ?? "" },
    nativeFlowMessage,
    bloksWidget: a2ui.build({ type, wrapped }),
    ...(expiration || Object.keys(contextInfo).length
      ? { contextInfo: { ...(expiration ? { expiration } : {}), ...contextInfo } }
      : {}),
  };

  const msg = generateWAMessageFromContent(jid, {
    viewOnceMessage: {
      message: {
        interactiveMessage
      }
    }
  }, { quoted });

  await sock.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id,
    additionalNodes: [
      {
        tag: "biz",
        attrs: {},
        content: [
          {
            tag: "interactive",
            attrs: { type: "native_flow", v: "1" },
            content: [{ tag: "native_flow", attrs: { v: "9", name: "mixed" } }],
          }
        ],
      }
    ],
  });

  return msg;
}

function wrapText(text, maxLineLength = 34) {
  return String(text ?? "").split("\n").map((paragraph) => {
    if (!paragraph || paragraph.length <= maxLineLength) return paragraph;

    const words = paragraph.split(/\s+/);
    const lines = [];
    let line = "";

    for (const word of words) {
      if (!line) {
        line = word;
      } else if (`${line} ${word}`.length <= maxLineLength) {
        line += ` ${word}`;
      } else {
        lines.push(line);
        line = word;
      }
    }

    if (line) lines.push(line);
    return lines.join("\n");
  }).join("\n");
}

function makeA2UIHelper(sock) {
  if (!sock) throw new Error("Socket is required");
  if (sock.sendA2UI) return sock;

  Object.defineProperty(sock, "sendA2UI", {
    configurable: true,
    enumerable: false,
    writable: true,
    value: async function (jid, content = {}, sendOptions = {}) {
      const {
        quoted,
        buttons = [],
        bodyText = "",
        footer = "",
        contextInfo = {},
        expiration,
        type = "im_a2ui",
        wrapped = true,
      } = sendOptions;

      let ui;
      if (content instanceof A2UI) {
        ui = content;
      } else if (content.a2ui instanceof A2UI) {
        ui = content.a2ui;
      } else {
        ui = new A2UI(content.a2uiOptions);

        const listCard = content.listCard ?? (content.type === "listCard" ? content : null);
        if (listCard) {
          ui.listCard(listCard);
        } else {
          const columnChildren = [];

          if (content.image) {
            const imgId = ui.image(content.image, {
              id: "image_header",
              variant: content.imageVariant ?? "header",
              fit: content.fit ?? "cover",
            });
            columnChildren.push(imgId);
          }

          if (content.text !== undefined && content.text !== null) {
            const textId = ui.text(wrapText(content.text, content.maxLineLength ?? 34), {
              id: "text_desc",
              variant: content.textVariant ?? "caption",
            });
            columnChildren.push(textId);
          }

          if (!columnChildren.length) {
            throw new TypeError("sendA2UI requires text, image, listCard, or an A2UI instance");
          }

          const colId = ui.column(columnChildren, { id: "column_content" });
          const cardId = ui.card(colId, { id: "card_main" });
          ui.root([cardId]);
        }
      }

      return sendA2UIWidget(sock, jid, {
        a2ui: ui,
        buttons: content.buttons ?? buttons,
        bodyText: content.bodyText ?? bodyText,
        footer: content.footer ?? footer,
        contextInfo: content.contextInfo ?? contextInfo,
        expiration: content.expiration ?? expiration,
        quoted: sendOptions.quoted ?? content.quoted ?? quoted,
        type: content.type === "listCard" ? "im_a2ui" : (content.type ?? type),
        wrapped: content.wrapped ?? wrapped,
      });
    },
  });

  return sock;
}

export { A2UI, sendA2UIWidget, makeA2UIHelper };