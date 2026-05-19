# Sistema de Afiliados DentPlus

Sistema web de gestión de afiliados con autenticación, roles de usuario y tipos de membresía. Construido con Express, TypeScript, Prisma y PostgreSQL.

## Stack

- **Runtime**: Node.js
- **Lenguaje**: TypeScript
- **Framework**: Express 5
- **Base de datos**: PostgreSQL
- **ORM**: Prisma 7
- **Motor de plantillas**: Handlebars (express-handlebars)
- **Autenticación**: express-session + bcryptjs
- **Validación**: Zod
- **Package manager**: Yarn

## Estructura del proyecto

```
├── prisma/
│   ├── schema.prisma        # Definición de modelos y relaciones
│   ├── migrations/          # Historial de migraciones
│   └── seed.ts              # Datos iniciales para desarrollo
├── src/
│   ├── controllers/
│   │   ├── affiliate.controller.ts
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── lib/
│   │   ├── parseError.ts    # Formatea errores de Zod
│   │   └── prisma.ts        # Instancia del cliente de Prisma
│   ├── middleware/
│   │   └── requireAuth.ts   # Protege rutas sin sesión activa
│   ├── models/
│   │   ├── affiliate.model.ts
│   │   └── user.model.ts
│   ├── routes/
│   │   ├── affiliate.routes.ts
│   │   └── auth.routes.ts
│   ├── schemas/
│   │   ├── affiliate.schemas.ts  # Validaciones Zod para afiliados
│   │   └── auth.schemas.ts       # Validaciones Zod para login/register
│   ├── types/
│   │   └── session.d.ts     # Extensión de tipos de express-session
│   ├── app.ts               # Configuración de Express
│   └── index.ts             # Punto de entrada
├── views/                   # Vistas Handlebars
├── prisma.config.ts         # Configuración de Prisma
├── tsconfig.json
├── tsdown.config.ts
├── nodemon.json
├── eslint.config.mjs
└── .env                     # Variables de entorno (no se sube al repo)
```

## Requisitos

- Node.js 18+
- PostgreSQL
- Yarn

## Instalación

```bash
# Clonar el repositorio
git clone <url>
cd sistema-afiliados-dentplus

# Instalar dependencias
yarn install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus datos de conexión
```

## Variables de entorno

```dotenv
DATABASE_URL=
PORT=
SESSION_SECRET=
```

## Base de datos

```bash
# Crear las tablas
npx prisma migrate dev

# Generar el cliente de Prisma
npx prisma generate

# Poblar con datos de prueba
npx prisma db seed

# Ver la base de datos en el navegador
npx prisma studio
```

## Scripts

```bash
yarn dev        # Inicia el servidor en modo desarrollo con hot reload
yarn build      # Compila TypeScript a JavaScript
yarn start      # Inicia el servidor desde el build compilado
yarn lint       # Revisa el código con ESLint
yarn lint:fix   # Corrige errores de ESLint automáticamente
```

## Modelos

### User
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int | Clave primaria autoincremental |
| email | String | Email único del usuario |
| password | String | Contraseña hasheada con bcryptjs |
| role | Role | Rol del usuario (ADMIN o USER) |
| status | Boolean | Estado activo/inactivo (default: true) |
| createdAt | DateTime | Fecha de creación |

### MembershipType
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int | Clave primaria autoincremental |
| name | String | Nombre único del tipo de membresía |
| discount | Float | Porcentaje de descuento |

### Affiliate
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int | Clave primaria autoincremental |
| first_name | String | Nombre del afiliado |
| last_name | String | Apellido del afiliado |
| email | String | Email único del afiliado |
| status | Boolean | Estado activo/inactivo (default: true) |
| userId | Int | Usuario que gestiona el afiliado |
| membershipTypeId | Int | Tipo de membresía asignado |
| createdAt | DateTime | Fecha de creación |

## Rutas

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /login | Formulario de login |
| POST | /login | Procesa el login |
| GET | /login/register | Formulario de registro |
| POST | /login/register | Procesa el registro |
| POST | /logout | Cierra la sesión |

### Afiliados (requieren sesión activa)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /affiliates | Lista de afiliados |
| GET | /affiliates/:id | Detalle de un afiliado |
| GET | /affiliates/create | Formulario de creación |
| POST | /affiliates/create | Crea un afiliado |
| GET | /affiliates/:id/edit | Formulario de edición |
| POST | /affiliates/:id/edit | Actualiza un afiliado |
| POST | /affiliates/:id/deactivate | Desactiva un afiliado |
| POST | /affiliates/:id/activate | Activa un afiliado |

## Roles

- **USER** → ve y gestiona solo sus propios afiliados
- **ADMIN** → ve y gestiona todos los afiliados y usuarios

## Notas de desarrollo

- `src/generated/prisma/` es autogenerado, no se sube al repositorio. Ejecutar `npx prisma generate` después de clonar.
- `dist/` es autogenerado, no se sube al repositorio. Ejecutar `yarn build` para generarlo.
- Las contraseñas se hashean con bcryptjs en el controller, nunca en el modelo.
- El `userId` se toma siempre de `req.session.userId`, nunca del formulario.
- Las bajas son lógicas (soft delete), los registros no se eliminan de la DB.