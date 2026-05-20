import express from 'express'
import path from 'path'
import {engine} from 'express-handlebars'
import session from 'express-session'
import affiliateRouter from './routes/affiliate.routes'
import authRouter from './routes/auth.routes'
import { requireAuth } from './middleware/requireAuth'

const app = express()

const viewsPath = path.join(__dirname, '..', 'views')

app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(viewsPath, 'layouts'),
    helpers: {
        eq: (a: unknown, b: unknown) => a == b,
        capitalize: (value: string) =>
            value ? value.charAt(0).toUpperCase() + value.slice(1) : '',
    }
}))

app.set('view engine', 'hbs')
app.set('views', viewsPath)

app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: process.env.SESSION_SECRET ?? 'dev-secret',
    resave: false,
    saveUninitialized: false,
}))

app.use((req, _res, next) => {
    _res.locals.session = req.session
    next()
})

app.get('/', (_req, res) => res.render('home'))
app.use('/login', authRouter)
app.use('/affiliates', requireAuth, affiliateRouter)

export default app