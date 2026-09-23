# Sitio web y panel PANTOJA

Este proyecto contiene el sitio público de PANTOJA y un panel de administración para gestionar vehículos, repuestos, fotos y datos de contacto. El botón de compra abre WhatsApp: no existe carrito ni cobro en línea.

## Lo que incluye

- Portada adaptable a celular, tablet y computadora.
- Catálogos de vehículos y repuestos con buscador y filtros.
- Fichas individuales con cotización por WhatsApp y llamada directa.
- Páginas Nosotros y Contacto, con sedes de Arequipa y Tacna.
- Panel `/admin` con inicio de sesión, listas, formularios, configuración e importación CSV.
- Base de datos, seguridad y almacenamiento de fotos preparados para Supabase.
- SEO: títulos, descripciones, tarjeta social, sitemap, robots y datos estructurados.

## 1. Crear el proyecto en Supabase

1. Entra a [Supabase](https://supabase.com), crea una cuenta y pulsa **New project**.
2. Elige un nombre, una contraseña segura para la base de datos y una región cercana.
3. Cuando el proyecto termine de crearse, abre **SQL Editor**.
4. Pulsa **New query**, copia todo el contenido de `supabase/schema.sql` y pulsa **Run**.
5. El script crea las tablas, las políticas de seguridad, el espacio público `productos` para fotos y datos iniciales de los cuatro modelos y doce repuestos.

Puedes ejecutar el script otra vez sin duplicar los datos iniciales.

## 2. Crear el usuario administrador

No hay registro público. El administrador se crea manualmente:

1. En Supabase abre **Authentication → Users**.
2. Pulsa **Add user → Create new user**.
3. Escribe el correo y una contraseña segura.
4. Activa **Auto Confirm User** y confirma.
5. Usa ese correo y contraseña en `/admin/login`.

## 3. Configurar las variables

1. Duplica `.env.example` y nombra la copia `.env.local`.
2. En Supabase abre **Project Settings → API**.
3. Copia **Project URL** en `NEXT_PUBLIC_SUPABASE_URL`.
4. Copia la clave **anon / publishable** en `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Copia la clave **service_role** en `SUPABASE_SERVICE_ROLE_KEY`.
6. Al publicar, cambia `NEXT_PUBLIC_SITE_URL` por el dominio final, por ejemplo `https://pantoja.pe`.

La clave `SUPABASE_SERVICE_ROLE_KEY` es secreta. Nunca debe compartirse ni aparecer en una página del navegador.

## 4. Ejecutar el sitio en una computadora

Con Node.js 22 o superior instalado:

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. El panel está en `http://localhost:3000/admin`.

## 5. Publicar

### En Vercel

1. Sube este proyecto a un repositorio privado de GitHub.
2. Entra a [Vercel](https://vercel.com), pulsa **Add New → Project** e importa el repositorio.
3. Agrega las cuatro variables del archivo `.env.example` en **Environment Variables**.
4. Pulsa **Deploy**.
5. Coloca el dominio asignado por Vercel en `NEXT_PUBLIC_SITE_URL` y vuelve a desplegar.

Este proyecto también contiene la configuración necesaria para publicarse con OpenAI Sites.

## 6. Cómo agregar un vehículo paso a paso

1. Abre `/admin/login` e inicia sesión.
2. En el menú oscuro elige **Vehículos**.
3. Pulsa el botón rojo **Agregar vehículo**.
4. En **Información básica**, escribe el nombre y selecciona modelo, categoría y año. El slug se crea automáticamente.
5. En **Precio**, ingresa el monto o activa **Mostrar “Consultar precio”**.
6. Abre **Especificaciones técnicas** y completa capacidad, motor, potencia, transmisión y combustible.
7. En **Equipamiento**, escribe una característica y presiona Enter. Toca una etiqueta para eliminarla.
8. En **Fotos**, arrastra o selecciona imágenes JPG, PNG o WebP. La primera queda marcada como portada.
9. Marca las sedes donde está disponible y decide si se publica o aparece destacado.
10. Pulsa **Guardar vehículo**. Aparecerá la confirmación “Vehículo guardado ✓”.

Las fotos se pueden elegir desde la galería o la cámara del teléfono. Para una carga rápida, usa imágenes horizontales, bien iluminadas y menores de 5 MB.

## 7. Agregar e importar repuestos

Para agregar uno, entra a **Repuestos → Agregar repuesto**, completa nombre, SKU, categoría, compatibilidad, stock y precio, y pulsa Guardar.

Para una carga masiva:

1. Entra a **Repuestos → Importar CSV**.
2. Descarga la plantilla incluida.
3. Completa una fila por repuesto sin cambiar los títulos de las columnas.
4. Selecciona el CSV y revisa la vista previa.
5. Corrige las filas señaladas y confirma la importación.

## 8. Cambiar WhatsApp, sedes y horario

1. En el panel abre **Configuración**.
2. Cambia WhatsApp con código de país y sin espacios; para Perú empieza por `51`.
3. Edita el teléfono visible, horario, direcciones y enlaces de Google Maps.
4. También puedes cambiar o apagar el banner promocional.
5. Pulsa **Guardar configuración**.

Todos los botones del sitio usan el número guardado aquí.

## 9. Recomendaciones para fotos

- Vehículos: formato horizontal, fondo limpio y varias vistas (frontal, lateral, interior y posterior).
- Repuestos: fondo claro, pieza completa y etiqueta o código legible.
- No uses fotos reenviadas muchas veces por WhatsApp; pierden calidad.
- La primera imagen de cada producto es la portada.

## Archivos importantes

- `supabase/schema.sql`: tablas, políticas y datos iniciales.
- `.env.example`: lista de variables requeridas.
- `lib/whatsapp.ts`: formato único de enlaces y mensajes de WhatsApp.
- `public/logo-dorado.png`: logotipo oficial entregado.
- `public/repuestos-plantilla.csv`: plantilla para importación masiva.
