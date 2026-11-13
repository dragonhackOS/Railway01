# Seminario Conciliar de Yucatán — Sitio Web

Sitio web institucional del Seminario Conciliar de Yucatán "San Ildefonso" / Seminario Menor "San Felipe de Jesús".

## Requisitos

- Node.js 18 o superior

## Instalación y arranque local

```
npm install
npm start
```

El sitio queda disponible en `http://localhost:3000`.

## Estructura

- `public/` — sitio estático generado (HTML, CSS, JS, imágenes)
- `build.py` y `pages_*.py` — generadores Python que producen las páginas en `public/` (ejecutar `python3 build.py` tras editar el contenido)
- `server.js` — servidor Express que sirve el sitio y expone el panel de administración
- `lib/` — lógica del panel de administración (plantillas y manejo de configuración)
- `data/config.json` — configuración editable desde el panel de administración

## Panel de administración

Disponible en `/admin`.

**Contraseña por defecto:** `Seminario2026`

Se recomienda **cambiar la contraseña inmediatamente** después del primer acceso, desde la misma sección del panel.

Opciones disponibles:

- **Modo mantenimiento**: pone el sitio fuera de servicio para los visitantes (muestra una pantalla de mantenimiento) mientras un administrador con sesión iniciada sigue viendo el sitio normalmente. Incluye un mensaje personalizable.
- **Banner de aviso**: muestra un aviso fijo en la parte superior del sitio (por ejemplo, para anunciar inscripciones) sin necesidad de modificar el código.
- **Teléfonos de contacto**: edita los números que se muestran en las páginas de Contacto y Donativos.
- **Redes sociales**: edita los enlaces de Facebook, Instagram, YouTube y WhatsApp del pie de página.
- **Contraseña del panel**: permite cambiar la contraseña de acceso al panel.

## Importante: persistencia en Railway

Railway, por defecto, usa un sistema de archivos efímero: cualquier cambio guardado en `data/config.json` (modo mantenimiento, banner, teléfonos, redes, contraseña) **puede perderse** la próxima vez que se vuelva a desplegar el proyecto (redeploy).

Si se quiere que los cambios hechos desde el panel de administración persistan entre despliegues, hay que agregar un **Volume** de Railway montado en la carpeta `data/` del servicio:

1. En el proyecto de Railway, ir a la pestaña **Volumes** del servicio.
2. Crear un volumen nuevo.
3. Montarlo en la ruta `/app/data` (o la ruta equivalente donde se despliegue el proyecto).
4. Volver a desplegar.

Sin este paso, el sitio funciona perfectamente, pero los cambios del panel sólo se mantendrán hasta el siguiente despliegue.

## Despliegue en Railway

El proyecto incluye `Procfile` y `railway.json` listos para desplegarse directamente. Railway detecta automáticamente el proyecto Node.js, instala dependencias con `npm install` y lo inicia con `npm start`.
