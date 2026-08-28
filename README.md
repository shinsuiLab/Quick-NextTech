# QuickNextTech — Proyecto Docker (Unidad 1)

## Arquitectura

Usuario → [proxy: nginx:alpine] → [frontend: Node/Express]

                          [proxy: nginx:alpine] → [backend: Node/Express] → [db: MySQL]

- Solo el contenedor `proxy` publica un puerto al host (80). Todo lo demás es interno.
- El proxy pertenece a 2 redes (habla con frontend y con backend).
- El backend pertenece a 2 redes (habla con proxy y con db).
- La base de datos NUNCA está expuesta al host ni a la red de acceso del usuario.

## Redes Docker

| Red          | Contenedores conectados |
|--------------|---------------------------|
| red-acceso   | proxy ↔ frontend           |
| red-app      | proxy ↔ backend            |
| red-datos    | backend ↔ db               |

## Distribución de trabajo

| Integrante | Responsable de |
|------------|-----------------|
| Jonathan   | `db/` (init.sql, esquema de tabla `productos`) |
| Nicolas    | `backend/` (package.json, server.js, Dockerfile) |
| Angel      | `frontend/` (package.json, server.js, Dockerfile) y `proxy/` (nginx.conf) |

## Variables de entorno

Nadie sube su `.env` real a GitHub (está en `.gitignore`).
Usar `.env.example` como referencia de nombres de variables.
Angel comparte el `.env` real por chat privado del equipo.

Variables usadas:
- `DB_ROOT_PASSWORD`: contraseña root de MySQL
- `DB_NAME`: nombre de la base de datos (quicknexttech)
- `DB_PASSWORD`: contraseña que usa el backend para conectarse a MySQL

## Convenciones técnicas (NO cambiar sin avisar al equipo)

- Todas las imágenes Node usan: `node:20-alpine`
- El backend escucha internamente en el puerto **3000**
- El frontend escucha internamente en el puerto **3000**
- El proxy usa la imagen oficial `nginx:alpine` (Docker Hub), sin build propio
- La base de datos usa la imagen oficial `mysql:8`
- El backend se conecta a la BD usando el hostname del servicio: `db` (no usar IPs)
- El frontend se conecta al backend usando el hostname del servicio: `backend`
- Endpoints backend esperados por el frontend:
  - `GET /api/productos`
  - `GET /api/dashboard`

## Flujo de imágenes Docker Hub

1. Fase desarrollo: docker-compose usa `build:` para backend y frontend (pruebas locales rápidas).
2. Cuando tu contenedor funcione localmente, publica tu imagen:
   `docker build -t TU_USUARIO/quicknexttech-<servicio>:1.0 ./<carpeta>`
   `docker push TU_USUARIO/quicknexttech-<servicio>:1.0`
4. Avisa al equipo el nombre exacto de tu imagen publicada (usuario/nombre:tag).
5. Angel (responsable del compose final) actualiza docker-compose.yml de `build:` a `image:` con esos nombres.
6. Entrega final: `docker compose up -d` debe funcionar en cualquier equipo, descargando las imágenes desde Docker Hub — SIN necesitar el código fuente local de backend/frontend (restricción 15).

Imágenes usadas:

| Servicio  | Imagen                                          | Origen |
|-----------|---------------------------------------------------|--------|
| db        | mysql:8                                            | oficial |
| backend   | [pendiente: usuario/quicknexttech-backend:1.0]      | propia, a publicar |
| frontend  | [pendiente: usuario/quicknexttech-frontend:1.0]     | propia, a publicar |
| proxy     | nginx:alpine                                       | oficial |

## Restricciones críticas a recordar

- Restricción 13: nada de `docker exec` para arreglar algo después de `docker compose up`. Si algo falla, se corrige en el Dockerfile/código y se reconstruye.
- Restricción 14: no editar archivos dentro del contenedor en ejecución para "hacerlo funcionar".
- Restricción 16: nunca subir el `.env` real ni contraseñas en server.js/docker-compose.yml directamente — siempre usar variables de entorno.

## Cómo correr el proyecto (una vez que cada quien tenga su parte lista)

```bash
docker compose up -d --build
```
Acceder en el navegador a `http://localhost`

## Contrato entre contenedores (NO romper sin avisar a los 3)

### Base de datos (Jonathan)
- Nombre de la base: `quicknexttech`
- Tabla: `productos`
- Columnas exactas: `id, nombre, categoria, precio, stock, unidades_vendidas`
- Mínimo 30 filas (restricción 11: los productos deben crearse automáticamente vía init.sql)
- El init.sql se monta como volumen en `/docker-entrypoint-initdb.d/` — NO se ejecuta a mano

### Variables de entorno (usadas por db y backend)
| Variable          | Usada en          | Descripción                              |
|-------------------|--------------------|--------------------------------------------|
| DB_ROOT_PASSWORD  | db (compose)        | contraseña root de MySQL                   |
| DB_NAME           | db (compose)        | nombre de la base = quicknexttech          |
| DB_PASSWORD       | backend (server.js) | contraseña que usa Node para conectarse a MySQL |

Backend se conecta así (Nicolas debe usar esto exacto en su server.js):
```js
const db = mysql.createConnection({
    host: "db",                      // nombre del servicio en docker-compose, no localhost ni IP
    user: "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "quicknexttech"
});
```

### Backend → Frontend (Nicolas expone, Angel consume)
- Host interno: `backend`, puerto `3000`
- `GET /api/productos` → devuelve un array de objetos:
```json
[
  { "id": 1, "nombre": "...", "categoria": "...", "precio": 12.50, "stock": 40, "unidades_vendidas": 15 }
]
```
- `GET /api/dashboard` → devuelve UN objeto con estas claves exactas (el frontend ya está armado para leer esta forma exacta, no cambiar nombres):
```json
{
  "total": 30,
  "promedio": 15.75,
  "masBarato": { "nombre": "...", "precio": 5.00 },
  "masCaro": { "nombre": "...", "precio": 40.00 },
  "top3Economicos": [ { "nombre": "...", "precio": 5.00 }, ... ],
  "top5Vendidos": [ { "nombre": "...", "unidades_vendidas": 90 }, ... ],
  "stockTotal": 850
}
```

### Frontend → Proxy (Angel)
- Frontend escucha en puerto interno `3000`
- Proxy enruta `/` → `frontend:3000` y `/api/` → `backend:3000`
- Frontend NUNCA se accede directo desde el host, solo vía proxy en `http://localhost`


## Estado del proyecto

- [X] init.sql con tabla productos (30+ filas) — Jonathan
- [ ] backend con endpoints /api/productos y /api/dashboard — Nicolas
- [X] frontend consumiendo backend — Angel
- [X] proxy/nginx.conf enrutando / → frontend y /api/ → backend — Angel
- [ ] docker-compose.yml integrando los 4 servicios y 3 redes — Angel
