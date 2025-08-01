# Fototeca UF1844

Una pequeña aplicación web de galería de imágenes desarrollada con Node.js, Express y EJS. Permite añadir imágenes con título, descripción y URL, y muestra la galería en la página principal.

## Características

- Añade imágenes con título, descripción y URL.
- Vista moderna y responsive gracias a PicoCSS.
- Página de error 404 personalizada para rutas no existentes.
- Registro de peticiones HTTP con morgan.

## Instalación

1. Clona este repositorio o descarga los archivos.
2. Instala las dependencias:

```bash
npm install
```

3. Inicia el servidor:

```bash
npm run dev
```

4. Abre tu navegador en [http://localhost:3000](http://localhost:3000)

## Estructura del proyecto

```
index.js              # Servidor principal Express
package.json          # Dependencias y scripts
views/                # Vistas EJS
  ├── 404.ejs         # Página de error 404
  ├── add-image.ejs   # Formulario para añadir imágenes
  ├── home.ejs        # Galería principal
  └── partials/
      └── navbar.ejs  # Barra de navegación
```

## Endpoints principales

- `/`                - Página principal con la galería de imágenes
- `/new-image`       - Formulario para añadir una nueva imagen

## Notas

- Las imágenes se almacenan en memoria (array), por lo que se pierden al reiniciar el servidor.
- El proyecto está pensado para fines didácticos.

## Autor
Óscar Miras

---
¡Disfruta programando y mejorando tu fototeca!
