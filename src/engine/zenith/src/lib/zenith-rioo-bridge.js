// Compatibility bridge: fitur port xorizn-bot wajib berjalan di atas core xorizn-bot.
import { getDatabase } from "./zenith-database.js";
import { f as httpRequest } from "./zenith-http.js";
import { fetchJson, randomInt, md5 } from "./zenith-utils.js";
import { sendText } from "./zenith-message.js";
import { zenithApiManager } from "./zenith-apimanager.js";
import config from "../../config.js";

export { getDatabase, httpRequest, fetchJson, randomInt, md5, sendText, zenithApiManager, config };

export async function riooJson(url, options = {}) {
  const { method = "GET", headers = {}, body = null, timeout } = options;
  if (timeout) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        signal: controller.signal,
      });
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }
  return fetchJson(url, options.fetchOptions || {});
}
