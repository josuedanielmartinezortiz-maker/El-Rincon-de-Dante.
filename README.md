# El Rincón de Dante 🐉

Estudio creativo web para organizar historias, escenas, prompts de animación y continuidad de personajes desde el navegador.

## Archivos
- `index.html`: estructura de la interfaz.
- `style.css`: diseño adaptable a móvil y escritorio.
- `script.js`: navegación, borradores locales y memoria del proyecto.

## Funciones actuales
- Navegación entre Inicio, Historias, Escenas y prompts, y Personajes.
- Generador local de borradores estructurados para historias, escenas y fichas de continuidad.
- Área de memoria para guardar canon, reglas y descubrimientos.
- Guarda la idea actual y las notas en el almacenamiento local del navegador.

## Importante sobre la memoria
La memoria actual se guarda solo en el navegador y dispositivo donde se usa. No es una base de datos en la nube y no se sincroniza entre dispositivos. Si se borran los datos del navegador, esas notas podrían perderse; conviene guardar una copia del canon importante en otro lugar.

## Estado de la IA
Esta versión todavía no llama a un modelo de IA. Los borradores se generan mediante reglas locales y están identificados como tales. Para añadir IA real, el siguiente paso será elegir un proveedor compatible y crear un pequeño backend que mantenga las claves secretas fuera del código del navegador. **No se debe colocar una clave privada de API en `script.js` ni en ningún archivo público del sitio.**

## Próximas etapas
1. Probar las funciones locales y corregir errores.
2. Mejorar el formato de salida para guiones y prompts de video.
3. Añadir exportación e importación de la biblia del proyecto.
4. Elegir un proveedor de IA y verificar precio, límites, privacidad y requisitos de edad/cuenta.
5. Conectar el proveedor a través de un backend seguro.
6. Diseñar un sistema de herramientas para que el director creativo elija qué modelo usar en cada tarea.

## Uso
Abre `index.html` en un navegador o publica el repositorio con un servicio de hosting estático compatible. El prototipo local puede funcionar sin una API, aunque algunas fuentes tipográficas dependen de internet.


## Backend preparado (versión 0.2)
- `server.js` crea un endpoint `POST /api/chat` y un endpoint `GET /api/status`.
- `package.json` define Express y el comando de inicio.
- `.env.example` muestra los nombres de configuración sin incluir claves reales.
- `.gitignore` evita subir `.env` y dependencias.
- La interfaz intenta usar el endpoint y vuelve al borrador local si el backend no está activo o no está configurado.

### Configuración pendiente
Este backend usa un formato compatible con Chat Completions. Antes de desplegarlo, elige un proveedor que admita ese formato y revisa sus condiciones, límites, costo y requisitos de edad. Configura `AI_BASE_URL`, `AI_API_KEY` y `AI_MODEL` como variables secretas del servidor. No introduzcas una clave real en los archivos del repositorio. El endpoint no queda operativo con una API real hasta configurar esas variables y desplegarlo en un host que soporte Node.js.


## Director inteligente (beta local)
La interfaz incluye un selector de tarea: automático, historia, escenas, personajes, continuidad, mecánicas de juego o código. El selector orienta los borradores locales y se envía al backend en el campo `section` junto con el texto de la tarea y las notas. Las salidas locales son plantillas, no razonamiento de un modelo real. Cuando se configure un proveedor, conviene enviar también el tipo de tarea explícito y probar cada ruta con ejemplos reales.
