# Sistema de Afiliados DentPlus

Aplicación web para gestionar afiliados de una clínica dental: registro de usuarios, inicio de sesión, roles **ADMIN** / **USER**, tipos de membresía con descuento y CRUD de afiliados con bajas lógicas (activar / desactivar).

Renderizado en servidor (SSR) con **Express**, **Handlebars**, **TypeScript**, **Prisma** y **PostgreSQL**.

**Repositorio:** [github.com/Wuanpack/afiliados_dentplus](https://github.com/Wuanpack/afiliados_dentplus)

---

## Características principales

- Autenticación con sesión (`express-session`) y contraseñas hasheadas (`bcryptjs`).
- Registro e inicio de sesión con validación **Zod**.
- Bloqueo de login si la cuenta de usuario está desactivada (`status: false`).
- Dos roles: usuario normal y administrador.
- CRUD de afiliados (crear, ver, editar, activar / desactivar).
- Tipos de membresía (silver, gold, platinum) con porcentaje de descuento.
- Permisos por rol: el **USER** solo ve y edita sus afiliados; el **ADMIN** ve todos los afiliados y puede gestionar usuarios.
- Soft delete: los registros no se eliminan de la base de datos; se cambia el campo `status`.
- Interfaz con **Bootstrap 5** (CDN).

---

## Stack tecnológico

| Herramienta          | Versión         | Descripción                                                                                                            |
| -------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Node.js              | 18+             | Runtime utilizado para ejecutar la aplicación backend y el entorno de desarrollo del proyecto.                         |
| TypeScript           | 6.0.3           | Lenguaje principal del proyecto, utilizado para desarrollar aplicaciones Node.js con tipado estático.                  |
| Express              | 5.2.1           | Framework HTTP utilizado para la construcción de la aplicación web y definición de rutas, middlewares y controladores. |
| express-handlebars   | 9.0.1           | Motor de plantillas utilizado para renderizar vistas dinámicas del lado del servidor mediante Handlebars.              |
| Bootstrap            | 5               | Framework CSS utilizado para el diseño responsivo y la construcción de interfaces gráficas.                            |
| PostgreSQL           | No especificada | Sistema de gestión de bases de datos relacional utilizado para la persistencia de datos del proyecto.                  |
| pg                   | 8.20.0          | Driver oficial de PostgreSQL para Node.js, utilizado para la conexión con la base de datos.                            |
| Prisma ORM           | 7.8.0           | ORM utilizado para modelado de datos, migraciones y consultas tipadas hacia PostgreSQL.                                |
| `@prisma/client`     | 7.8.0           | Cliente generado automáticamente por Prisma para interactuar con la base de datos desde TypeScript.                    |
| `@prisma/adapter-pg` | 7.8.0           | Adaptador de Prisma para integración optimizada con PostgreSQL utilizando el driver `pg`.                              |
| express-session      | 1.19.0          | Middleware utilizado para la administración de sesiones HTTP persistentes.                                             |
| bcryptjs             | 3.0.3           | Librería utilizada para hash y validación segura de contraseñas.                                                       |
| Zod                  | 4.4.3           | Librería utilizada para validación de datos y definición de esquemas tipados.                                          |
| dotenv               | 17.4.2          | Librería utilizada para cargar variables de entorno desde archivos `.env`.                                             |
| tsdown               | 0.21.10         | Herramienta de build utilizada para compilar y empaquetar el proyecto TypeScript.                                      |
| ts-node              | 10.9.2          | Ejecutor de TypeScript en tiempo real utilizado principalmente en desarrollo.                                          |
| tsx                  | 4.21.0          | Runtime para ejecutar archivos TypeScript y ESM de forma rápida durante desarrollo y scripts auxiliares.               |
| nodemon              | 3.1.14          | Herramienta de desarrollo que reinicia automáticamente la aplicación al detectar cambios en el código fuente.          |
| Yarn                 | No especificada | Gestor de paquetes utilizado para administrar dependencias, scripts y configuración del proyecto.                      |
| Docker               | No especificada | Plataforma utilizada para contenedorización y despliegue consistente de la aplicación.                                 |


---

## Arquitectura

Patrón **MVC** con capas separadas:

```
Navegador
   → Rutas (routes/)
   → Middleware (requireAuth)
   → Controladores (controllers/) — validación Zod, sesión, respuestas HTTP
   → Modelos (models/) — consultas Prisma
   → PostgreSQL
   ← Vistas Handlebars (views/)
```

### Alcance de afiliados (`affiliateScope`)

El controlador de afiliados usa un helper interno que define el alcance según el rol en sesión:

| Rol | `scopeUserId` | Efecto en el modelo |
|-----|---------------|---------------------|
| **USER** | `req.session.userId` | Solo afiliados propios |
| **ADMIN** | `undefined` | Todos los afiliados |

El modelo (`affiliate.model.ts`) unifica las consultas: si `userId` viene definido, filtra por dueño; si no, opera sobre cualquier registro (solo ADMIN).

---

## Estructura del proyecto

```
├── prisma/
│   ├── schema.prisma          # Modelos y relaciones
│   ├── migrations/            # Historial de migraciones
│   └── seed.ts                # Datos de prueba
├── src/
│   ├── controllers/
│   │   ├── affiliate.controller.ts
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts   # Activar / desactivar usuarios (ADMIN)
│   ├── generated/prisma/        # Cliente Prisma (generado, no editar)
│   ├── lib/
│   │   ├── parseError.ts        # Errores de Zod → objeto por campo
│   │   └── prisma.ts            # Cliente Prisma + singleton en desarrollo
│   ├── middleware/
│   │   └── requireAuth.ts       # Redirige a /login sin sesión
│   ├── models/
│   │   ├── affiliate.model.ts
│   │   └── user.model.ts
│   ├── routes/
│   │   ├── affiliate.routes.ts
│   │   └── auth.routes.ts
│   ├── schemas/
│   │   ├── affiliate.schemas.ts
│   │   └── auth.schemas.ts
│   ├── types/
│   │   └── session.d.ts         # Tipos de req.session
│   ├── app.ts                   # Express, Handlebars, sesión, rutas
│   └── index.ts                 # Arranque del servidor
├── views/
│   ├── layouts/main.hbs
│   ├── auth/                    # login, register
│   ├── affiliates/              # index, show, create, edit
│   ├── home.hbs
│   ├── 403.hbs
│   └── 404.hbs
├── prisma.config.ts
├── tsconfig.json
├── tsdown.config.ts
├── nodemon.json
├── eslint.config.mjs
├── Dockerfile
├── docker-compose.yml
└── .env                         # No se sube al repositorio
```

---

## Instalación

```bash
git clone https://github.com/Wuanpack/afiliados_dentplus.git
cd afiliados_dentplus
```

### Opción A — Docker (recomendado)

**Requisitos:** Docker y Docker Compose instalados. No se necesita Node.js ni PostgreSQL localmente.

```bash
docker compose up --build
```

Esto levanta automáticamente la base de datos, corre las migraciones, ejecuta el seed y arranca la app en `http://localhost:3000`.

Para detener:

```bash
docker compose down        # detiene los contenedores
docker compose down -v     # detiene y borra la base de datos
```

---

### Opción B — Local

**Requisitos:** Node.js 18+, PostgreSQL en ejecución, Yarn.

```bash
yarn install

cp .env.example .env
# Editar .env con tu DATABASE_URL y SESSION_SECRET
```

#### Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Cadena de conexión PostgreSQL (`postgresql://usuario:clave@host:puerto/nombre_db`) |
| `SESSION_SECRET` | Clave secreta para firmar la cookie de sesión (cambiar en producción) |

Ejemplo en `.env.example`:

```dotenv
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/afiliados_dentplus"
SESSION_SECRET=cambiar-en-produccion
```

#### Base de datos

> Si `yarn seed` no funciona, usar `yarn run seed`

```bash
npx prisma migrate dev
npx prisma generate
yarn seed

# Opcional: explorar datos
npx prisma studio
```

---

### Datos de prueba (seed)

| Tipo | Email | Contraseña | Rol |
|------|-------|------------|-----|
| Usuario | `alice@example.com` | `12345678` | USER |
| Administrador | `bob@example.com` | `12345678` | ADMIN |

Membresías: **silver** (5%), **gold** (10%), **platinum** (20%). El seed crea además varios afiliados de ejemplo.

---

## Scripts disponibles

> Si los scripts no funcionan, usar `yarn run <script>`

```bash
yarn dev      # Desarrollo con recarga (nodemon + ts-node) → http://localhost:3000
yarn build    # Compila TypeScript a dist/
yarn start    # Servidor en producción desde dist/index.cjs
yarn seed     # Ejecuta prisma/seed.ts
```

> El puerto por defecto es **3000** (`src/index.ts`). Para cambiarlo, modifica `PORT` en `index.ts` o extiende el proyecto para leer `process.env.PORT`.

---

## Modelo de datos

### User

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Int | Clave primaria |
| `email` | String | Único |
| `password` | String | Hash bcrypt |
| `role` | `ADMIN` \| `USER` | Rol (default: USER) |
| `status` | Boolean | Activo / inactivo (default: true) |
| `createdAt` | DateTime | Alta del usuario |

### MembershipType

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Int | Clave primaria |
| `name` | String | Único (ej. silver, gold) |
| `discount` | Float | Descuento (ej. 0.10 = 10%) |

### Affiliate

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Int | Clave primaria |
| `first_name` | String | Nombre |
| `last_name` | String | Apellido |
| `email` | String | Único |
| `status` | Boolean | Activo / inactivo |
| `userId` | Int | Usuario que gestiona el afiliado |
| `membershipTypeId` | Int | Tipo de membresía |
| `createdAt` | DateTime | Alta del afiliado |

Índice en `userId` (`@@index([userId])`) para optimizar listados por dueño.

---

## Rutas de la aplicación

### Públicas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Página de inicio |

### Autenticación (`/login`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/login` | Formulario de inicio de sesión |
| POST | `/login` | Procesar login |
| GET | `/login/register` | Formulario de registro |
| POST | `/login/register` | Crear cuenta (rol USER por defecto) |
| POST | `/login/logout` | Cerrar sesión |

### Afiliados (requieren sesión — middleware `requireAuth`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/affiliates` | Listado de afiliados (+ usuarios si ADMIN) |
| GET | `/affiliates/create` | Formulario nuevo afiliado |
| POST | `/affiliates` | Crear afiliado |
| GET | `/affiliates/:id` | Detalle |
| GET | `/affiliates/:id/edit` | Formulario edición |
| POST | `/affiliates/:id/edit` | Guardar cambios |
| POST | `/affiliates/:id/deactivate` | Desactivar afiliado (soft delete) |
| POST | `/affiliates/:id/activate` | Reactivar afiliado |

### Usuarios (solo ADMIN, bajo `/affiliates`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/affiliates/user/:id/deactivate` | Desactivar usuario |
| POST | `/affiliates/user/:id/activate` | Reactivar usuario |

Respuestas de error: vistas `404.hbs` y `403.hbs` cuando corresponde.

---

## Roles y permisos

### USER

- Ve y gestiona **solo** afiliados con su `userId` en sesión.
- Al crear un afiliado, `userId` se toma de `req.session.userId` (nunca del formulario).
- No puede activar ni desactivar otros usuarios.

### ADMIN

- Ve **todos** los afiliados (con datos de usuario y membresía en el listado).
- Ve la tabla de **usuarios** en `/affiliates`.
- Puede editar, activar y desactivar cualquier afiliado.
- Puede activar y desactivar cuentas de usuario.

---

## Flujo de autenticación

1. **Registro:** validación Zod → comprobar email único → hash de contraseña → crear usuario → iniciar sesión → redirigir a `/affiliates`.
2. **Login:** validación Zod → buscar por email → verificar bcrypt → rechazar si `status` es false → guardar `userId` y `role` en sesión.
3. **Rutas protegidas:** `requireAuth` redirige a `/login` si no hay `session.userId`.
4. **Logout:** destruir sesión y redirigir a `/login`.

---

## Validación (Zod)

| Esquema | Campos |
|---------|--------|
| `loginSchema` | email, password |
| `registerSchema` | email, password (mín. 8 caracteres) |
| `affiliateSchema` | first_name, last_name, email, membershipTypeId |

Los errores se muestran en la misma vista mediante `formatZodErrors`.

---

## Seguridad y buenas prácticas

- Contraseñas hasheadas en el **controlador**, no en el modelo.
- `userId` del afiliado creado siempre desde la **sesión**, no desde el body del formulario.
- Email de usuario y de afiliado **únicos** a nivel de base de datos.
- Cuentas desactivadas no pueden iniciar sesión.
- En producción: usar `SESSION_SECRET` fuerte y configurar cookies de sesión seguras (`secure`, `httpOnly`, `sameSite`).

---

## Notas de desarrollo

- Tras clonar: `npx prisma generate` (cliente en `src/generated/prisma/`).
- `dist/` se genera con `yarn build`; no versionar.
- Prisma 7 usa adaptador PostgreSQL; la URL va en `DATABASE_URL`.
- En desarrollo, `src/lib/prisma.ts` reutiliza una única instancia del cliente para evitar agotar conexiones con nodemon.
- El formulario de membresía en las vistas usa IDs fijos (1–3); conviene cargarlos desde la base de datos en una mejora futura.
- Existe `eslint.config.mjs`; puedes ejecutar ESLint manualmente si lo integras en `package.json`.

---

## Despliegue (resumen)

1. Configurar variables de entorno en el servidor.
2. `npx prisma migrate deploy` y `npx prisma generate`.
3. `yarn build` y `yarn start`.
4. Servir detrás de un proxy HTTPS y ajustar cookies de sesión para producción.

---

## Autor

- Nombre: Alonso García Espinoza
- Institución: IP San Sebastián
- Ramo: Desarrollo de Software Web I - Evaluación Unidad 2
- Docente: Boris Belmar Muñoz