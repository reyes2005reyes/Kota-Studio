# Cliente Catálogo

Estructura base para un catálogo de productos con galería y enlace de contacto por WhatsApp.

## Estructura

- `index.html`: punto de entrada de la interfaz.
- `assets/`: imágenes, favicon e iconos.
- `css/`: estilos base, layout y componentes.
- `js/`: lógica de carga de datos y renderizado.

## Uso

1. Coloca las imágenes dentro de `assets/img/catalogo/` y `assets/img/galeria/`.
2. Ajusta el contenido de `js/data/productos.js` con los productos reales.
3. Modifica la configuración en `js/config/constants.js` con los datos de contacto.
4. Abre `index.html` en el navegador o usa un servidor local.

## Recomendación

Puedes usar un servidor local simple como:

```bash
python -m http.server 8000
```

Luego visita `http://localhost:8000`.

## Correo del formulario de contacto

El backend necesita estas variables en su archivo `.env` para enviar los mensajes:

```env
SMTP_USER=tu-correo@gmail.com
SMTP_APP_PASSWORD=tu-clave-de-aplicacion
ALLOWED_ORIGIN=http://localhost:8000
```
