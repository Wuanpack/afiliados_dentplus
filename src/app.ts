import 'dotenv/config'
import express from 'express'
import path from 'path'
import { engine } from 'express-handlebars'
import session from 'express-session'
import affiliateRouter from './routes/affiliate.routes'
import authRouter from './routes/auth.routes'
import { requireAuth } from './middleware/requireAuth'

const app = express()

const viewsPath = path.join(__dirname, '..', 'views')
const isProduction = process.env.NODE_ENV === 'production'

app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(viewsPath, 'layouts'),
    helpers: {
      eq: (a: unknown, b: unknown) => a == b,
      capitalize: (value: string) =>
        value ? value.charAt(0).toUpperCase() + value.slice(1) : '',
      formatDate: (value: Date | string) => {
        if (!value) return ''
        return new Date(value).toLocaleDateString('es-CL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      },
      formatPercent: (value: number) => {
        if (value == null || Number.isNaN(Number(value))) return ''
        return `${Math.round(Number(value) * 100)}%`
      },
      roleBadgeClass: (role: string) =>
        role === 'ADMIN' ? 'bg-primary' : 'bg-secondary',
    },
  }),
)

app.set('view engine', 'hbs')
app.set('views', viewsPath)

app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
)

app.use((req, res, next) => {
  res.locals.session = req.session
  next()
})

app.get('/', (_req, res) => res.render('home'))
app.use('/login', authRouter)
app.use('/affiliates', requireAuth, affiliateRouter)

export default app
