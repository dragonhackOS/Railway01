const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join(__dirname, "..", "data", "config.json");

const DEFAULT_CONFIG = {
  maintenanceMode: false,
  maintenanceMessage: "Estamos realizando mejoras en el sitio. Vuelve a visitarnos en unos momentos.",
  bannerEnabled: false,
  bannerMessage: "",
  contact: {
    phoneMayor: "+52 999 927 0777",
    phoneMenor: "+52 999 943 6025",
  },
  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
    whatsapp: "#",
  },
  adminPasswordHash: "",
};

function readConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      contact: { ...DEFAULT_CONFIG.contact, ...(parsed.contact || {}) },
      social: { ...DEFAULT_CONFIG.social, ...(parsed.social || {}) },
    };
  } catch (err) {
    return { ...DEFAULT_CONFIG };
  }
}

function writeConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
}

function publicConfig(config) {
  return {
    bannerEnabled: config.bannerEnabled,
    bannerMessage: config.bannerMessage,
    contact: config.contact,
    social: config.social,
  };
}

module.exports = { readConfig, writeConfig, publicConfig, CONFIG_PATH };
