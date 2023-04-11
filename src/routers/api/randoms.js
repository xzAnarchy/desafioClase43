import { Router } from 'express'
import { calcular } from '../../api/randoms.js'
import { logError } from '../../loggers/index.js'

const randomsApiRouter = new Router()

randomsApiRouter.get('/api/randoms', async (req, res) => {
    const { cant = 100_000_000 } = req.query
    try {
        const result = await calcular(cant)
        res.json(result)
    } catch (error) {
        logError(error.message)
        next(error)
    }
})

export default randomsApiRouter