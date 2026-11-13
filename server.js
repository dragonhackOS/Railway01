const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");
const crypto = require("crypto");

const { readConfig, writeConfig, publicConfig } = require("./lib/config");
const { loginPage, dashboardPage, maintenancePage } = require("./lib/templates");

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 },
  })
);

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.redirect("/admin/login");
}

app.get("/api/site-config", (req, res) => {
  const config = readConfig();
  res.json(publicConfig(config));
});

app.get("/admin/login", (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.redirect("/admin");
  }
  res.send(loginPage(null));
});

app.post("/admin/login", (req, res) => {
  const config = readConfig();
  const password = req.body.password || "";
  const valid = config.adminPasswordHash && bcrypt.compareSync(password, config.adminPasswordHash);
  if (!valid) {
    return res.status(401).send(loginPage("Contraseña incorrecta."));
  }
  req.session.isAdmin = true;
  res.redirect("/admin");
});

app.get("/admin/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
});

app.get("/admin", requireAdmin, (req, res) => {
  const config = readConfig();
  const flash = req.session.flash || null;
  req.session.flash = null;
  res.send(dashboardPage(config, flash));
});

function setFlash(req, type, message) {
  req.session.flash = { type, message };
}

app.post("/admin/config/mantenimiento", requireAdmin, (req, res) => {
  const config = readConfig();
  config.maintenanceMode = req.body.maintenanceMode === "on";
  config.maintenanceMessage = (req.body.maintenanceMessage || "").trim() || config.maintenanceMessage;
  writeConfig(config);
  setFlash(req, "ok", config.maintenanceMode ? "El sitio ahora está en mantenimiento." : "El sitio está en línea nuevamente.");
  res.redirect("/admin");
});

app.post("/admin/config/banner", requireAdmin, (req, res) => {
  const config = readConfig();
  config.bannerEnabled = req.body.bannerEnabled === "on";
  config.bannerMessage = (req.body.bannerMessage || "").trim();
  writeConfig(config);
  setFlash(req, "ok", "Banner actualizado correctamente.");
  res.redirect("/admin");
});

app.post("/admin/config/contacto", requireAdmin, (req, res) => {
  const config = readConfig();
  config.contact.phoneMayor = (req.body.phoneMayor || "").trim() || config.contact.phoneMayor;
  config.contact.phoneMenor = (req.body.phoneMenor || "").trim() || config.contact.phoneMenor;
  writeConfig(config);
  setFlash(req, "ok", "Teléfonos de contacto actualizados.");
  res.redirect("/admin");
});

app.post("/admin/config/redes", requireAdmin, (req, res) => {
  const config = readConfig();
  config.social.facebook = (req.body.facebook || "#").trim();
  config.social.instagram = (req.body.instagram || "#").trim();
  config.social.youtube = (req.body.youtube || "#").trim();
  config.social.whatsapp = (req.body.whatsapp || "#").trim();
  writeConfig(config);
  setFlash(req, "ok", "Redes sociales actualizadas.");
  res.redirect("/admin");
});

app.post("/admin/password", requireAdmin, (req, res) => {
  const config = readConfig();
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const validCurrent = config.adminPasswordHash && bcrypt.compareSync(currentPassword || "", config.adminPasswordHash);
  if (!validCurrent) {
    setFlash(req, "error", "La contraseña actual no es correcta.");
    return res.redirect("/admin");
  }
  if (!newPassword || newPassword.length < 8) {
    setFlash(req, "error", "La nueva contraseña debe tener al menos 8 caracteres.");
    return res.redirect("/admin");
  }
  if (newPassword !== confirmPassword) {
    setFlash(req, "error", "Las contraseñas nuevas no coinciden.");
    return res.redirect("/admin");
  }
  config.adminPasswordHash = bcrypt.hashSync(newPassword, 10);
  writeConfig(config);
  req.session.destroy(() => {});
  res.redirect("/admin/login");
});

app.use((req, res, next) => {
  if (req.path.startsWith("/admin") || req.path.startsWith("/api/")) {
    return next();
  }
  const config = readConfig();
  if (config.maintenanceMode && !(req.session && req.session.isAdmin)) {
    const isAsset = req.path.startsWith("/assets") || req.path.startsWith("/css") || req.path.startsWith("/js");
    if (!isAsset) {
      return res.status(503).send(maintenancePage(config.maintenanceMessage));
    }
  }
  next();
});

app.use(express.static(path.join(__dirname, "public"), { extensions: ["html"] }));

app.get("/formacion/:etapa", (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "formacion", `${req.params.etapa}.html`), (err) => {
    if (err) next();
  });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(PORT, () => {
  console.log(`Seminario Conciliar de Yucatán escuchando en el puerto ${PORT}`);
});
