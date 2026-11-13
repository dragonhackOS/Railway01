const ADMIN_STYLES = `
:root {
  --vino: #6e1423;
  --vino-oscuro: #4a0f18;
  --dorado: #c9a227;
  --crema: #faf3e0;
  --texto: #2c2420;
  --texto-suave: #5a4f47;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: "Montserrat", "Segoe UI", sans-serif;
  background: var(--crema);
  color: var(--texto);
}
.admin-header {
  background: linear-gradient(120deg, var(--vino-oscuro), var(--vino));
  color: #fff;
  padding: 22px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.admin-header h1 {
  font-family: "Playfair Display", serif;
  font-size: 1.3rem;
  margin: 0;
}
.admin-header a {
  color: var(--crema);
  text-decoration: none;
  font-size: 0.85rem;
  border: 1px solid rgba(250,243,224,0.4);
  padding: 8px 16px;
  border-radius: 50px;
}
.admin-wrap {
  max-width: 920px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}
.admin-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px 30px;
  margin-bottom: 26px;
  box-shadow: 0 10px 30px rgba(74,15,24,0.1);
  border-top: 4px solid var(--dorado);
}
.admin-card h2 {
  font-family: "Playfair Display", serif;
  color: var(--vino);
  font-size: 1.15rem;
  margin: 0 0 6px;
}
.admin-card p.ayuda {
  color: var(--texto-suave);
  font-size: 0.85rem;
  margin: 0 0 18px;
}
label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--texto-suave);
  margin-bottom: 6px;
  margin-top: 14px;
}
input[type=text], input[type=password], textarea {
  width: 100%;
  padding: 11px 14px;
  border-radius: 8px;
  border: 1px solid #ddd0b8;
  font-family: inherit;
  font-size: 0.92rem;
}
textarea { min-height: 80px; resize: vertical; }
.switch-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
}
.switch-row input { width: 20px; height: 20px; }
.switch-row span { font-size: 0.92rem; font-weight: 600; }
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
button {
  margin-top: 20px;
  background: linear-gradient(135deg, #e3c565, var(--dorado));
  color: var(--vino-oscuro);
  border: none;
  padding: 13px 26px;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.9rem;
}
button.secundario {
  background: var(--vino);
  color: #fff;
}
.aviso {
  padding: 14px 18px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 0.88rem;
}
.aviso.ok { background: #e4f3e7; color: #1f6d3a; }
.aviso.error { background: #fbe4e4; color: #a32626; }
.estado-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 50px;
}
.estado-badge.activo { background: #fbe4e4; color: #a32626; }
.estado-badge.inactivo { background: #e4f3e7; color: #1f6d3a; }
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-card {
  background: #fff;
  border-radius: 18px;
  padding: 44px 38px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 20px 50px rgba(74,15,24,0.18);
  border-top: 5px solid var(--dorado);
}
.login-card h1 {
  font-family: "Playfair Display", serif;
  color: var(--vino);
  font-size: 1.3rem;
  margin: 0 0 4px;
}
.login-card p {
  color: var(--texto-suave);
  font-size: 0.85rem;
  margin: 0 0 20px;
}
`;

function page(title, body) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>${ADMIN_STYLES}</style>
</head>
<body>
${body}
</body>
</html>`;
}

function loginPage(error) {
  const errorHtml = error ? `<div class="aviso error">${error}</div>` : "";
  return page("Acceso administrador | Seminario Conciliar de Yucatán", `
<div class="login-wrap">
<div class="login-card">
<h1>Panel de administración</h1>
<p>Seminario Conciliar de Yucatán</p>
${errorHtml}
<form method="POST" action="/admin/login">
<label for="password">Contraseña</label>
<input type="password" id="password" name="password" required autofocus>
<button type="submit">Entrar</button>
</form>
</div>
</div>
`);
}

function checkbox(name, checked) {
  return `<input type="checkbox" id="${name}" name="${name}" ${checked ? "checked" : ""}>`;
}

function dashboardPage(config, flash) {
  const flashHtml = flash
    ? `<div class="aviso ${flash.type}">${flash.message}</div>`
    : "";
  const estado = config.maintenanceMode
    ? '<span class="estado-badge activo">Sitio en mantenimiento</span>'
    : '<span class="estado-badge inactivo">Sitio en línea</span>';

  return page("Panel de administración | Seminario Conciliar de Yucatán", `
<header class="admin-header">
<h1>Panel de administración</h1>
<div style="display:flex;align-items:center;gap:16px;">
${estado}
<a href="/" target="_blank">Ver sitio</a>
<a href="/admin/logout">Cerrar sesión</a>
</div>
</header>
<div class="admin-wrap">
${flashHtml}

<div class="admin-card">
<h2>Estado del sitio</h2>
<p class="ayuda">Al activar el mantenimiento, todos los visitantes verán el mensaje que definas aquí. Tu sesión de administrador seguirá viendo el sitio normalmente.</p>
<form method="POST" action="/admin/config/mantenimiento">
<div class="switch-row">
${checkbox("maintenanceMode", config.maintenanceMode)}
<span>Poner el sitio en mantenimiento / fuera de servicio</span>
</div>
<label for="maintenanceMessage">Mensaje que verán los visitantes</label>
<textarea id="maintenanceMessage" name="maintenanceMessage">${config.maintenanceMessage}</textarea>
<button type="submit">Guardar estado del sitio</button>
</form>
</div>

<div class="admin-card">
<h2>Banner de anuncio</h2>
<p class="ayuda">Muestra un mensaje destacado en la parte superior de todas las páginas (por ejemplo, avisos de la Súper Kermés o del Vocafest).</p>
<form method="POST" action="/admin/config/banner">
<div class="switch-row">
${checkbox("bannerEnabled", config.bannerEnabled)}
<span>Mostrar banner de anuncio</span>
</div>
<label for="bannerMessage">Texto del banner</label>
<input type="text" id="bannerMessage" name="bannerMessage" value="${config.bannerMessage}">
<button type="submit">Guardar banner</button>
</form>
</div>

<div class="admin-card">
<h2>Teléfonos de contacto</h2>
<p class="ayuda">Estos números se muestran en la página de Contacto y Donativos.</p>
<form method="POST" action="/admin/config/contacto">
<div class="grid-2">
<div>
<label for="phoneMayor">Seminario Mayor</label>
<input type="text" id="phoneMayor" name="phoneMayor" value="${config.contact.phoneMayor}">
</div>
<div>
<label for="phoneMenor">Seminario Menor</label>
<input type="text" id="phoneMenor" name="phoneMenor" value="${config.contact.phoneMenor}">
</div>
</div>
<button type="submit">Guardar teléfonos</button>
</form>
</div>

<div class="admin-card">
<h2>Redes sociales</h2>
<p class="ayuda">Enlaces que se usan en el pie de página y en Contacto.</p>
<form method="POST" action="/admin/config/redes">
<div class="grid-2">
<div>
<label for="facebook">Facebook</label>
<input type="text" id="facebook" name="facebook" value="${config.social.facebook}">
</div>
<div>
<label for="instagram">Instagram</label>
<input type="text" id="instagram" name="instagram" value="${config.social.instagram}">
</div>
<div>
<label for="youtube">YouTube</label>
<input type="text" id="youtube" name="youtube" value="${config.social.youtube}">
</div>
<div>
<label for="whatsapp">WhatsApp</label>
<input type="text" id="whatsapp" name="whatsapp" value="${config.social.whatsapp}">
</div>
</div>
<button type="submit">Guardar redes sociales</button>
</form>
</div>

<div class="admin-card">
<h2>Cambiar contraseña de administrador</h2>
<p class="ayuda">Usa una contraseña segura. Deberás volver a iniciar sesión después de cambiarla.</p>
<form method="POST" action="/admin/password">
<label for="currentPassword">Contraseña actual</label>
<input type="password" id="currentPassword" name="currentPassword" required>
<label for="newPassword">Nueva contraseña</label>
<input type="password" id="newPassword" name="newPassword" required minlength="8">
<label for="confirmPassword">Confirmar nueva contraseña</label>
<input type="password" id="confirmPassword" name="confirmPassword" required minlength="8">
<button type="submit" class="secundario">Cambiar contraseña</button>
</form>
</div>

</div>
`);
}

function maintenancePage(message) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sitio en mantenimiento | Seminario Conciliar de Yucatán</title>
<link rel="icon" href="/assets/img/favicon-64.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
<style>
body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #4a0f18, #6e1423);
  font-family: "Montserrat", sans-serif;
  color: #faf3e0;
  text-align: center;
  padding: 24px;
}
.caja {
  max-width: 480px;
}
img {
  width: 90px;
  margin-bottom: 24px;
}
h1 {
  font-family: "Playfair Display", serif;
  font-size: 1.8rem;
  margin: 0 0 16px;
  color: #fff;
}
p {
  font-size: 1rem;
  line-height: 1.6;
  color: #f2e6c9;
}
</style>
</head>
<body>
<div class="caja">
<img src="/assets/img/logo-seminario.png" alt="Seminario Conciliar de Yucatán">
<h1>Sitio en mantenimiento</h1>
<p>${message}</p>
</div>
</body>
</html>`;
}

module.exports = { loginPage, dashboardPage, maintenancePage };
