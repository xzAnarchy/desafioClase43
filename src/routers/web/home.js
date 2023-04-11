import { Router } from 'express'
import config from '../../config/config.js'

import path from 'path'

const productosWebRouter = new Router()

productosWebRouter.get('/home', webAuth, (req, res) => {
    res.sendFile('main.html', {root: 'public'})
    // res.render(path.join(process.cwd(), '/views/pages/home.ejs'), { nombre: req.session.nombre })
})

productosWebRouter.get('/productos-vista-test', (req, res) => {
    res.sendFile('productos-vista-test.html', { root: 'public' })
})

function webAuth(req, res, next) {
    if (req.session.passport?.user) {
        next()
    } else {
        res.redirect('/login')
    }
}

// export function apiAuth(req, res, next) {
//     if (req.session?.nombre) {
//         next()
//     } else {
//         res.status(401).json({ error: 'no autorizado!' })
//     }
// }

export default productosWebRouter