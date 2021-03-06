import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from "@ioc:Adonis/Core/HealthCheck";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";

const BASE_URL = Env.get('APP_URL')
const { version } = require('../package.json')

Route.get('/', async ({ response }: HttpContextContract) => {
  return response.status(200).send({
    domain: BASE_URL,
    version: version,
    source: `${BASE_URL}/source`,
    healthCheck: `${BASE_URL}/health`,
    links: `${BASE_URL}/links`
  })
})

Route.get('/source', async ({ response }: HttpContextContract) => {
  return response.redirect('https://github.com/arthurdanjou/artdanj-shortener')
})

Route.get('health', async ({ response }: HttpContextContract) => {
  const report = await HealthCheck.getReport()
  const isLive = await HealthCheck.isLive()
  const isReady = HealthCheck.isReady()
  return report.healthy ? response.ok({ isLive, isReady, report: report.report }) : response.badRequest({ isLive, isReady, report: report.report })
})

Route
  .group(() => {
    Route.post('/login', 'AuthController.login')
    Route.post('/logout', 'AuthController.logout')
    Route.post('/token', 'AuthController.token')
    Route.get('/user', 'AuthController.me')
  })
  .prefix('auth')

Route
  .group(() => {
    Route.post('/create', 'LinksController.store')
    Route.post('/update', 'LinksController.update')
    Route.post('/delete', 'LinksController.delete')
  })
  .prefix('options')
  .middleware('auth')

Route
  .group(() => {
    Route.resource('users', 'UsersController').except(['edit', 'create'])
  })
  .middleware('auth')

Route.get('/links', 'LinksController.index') // --> Home
Route.get('/:id', 'LinksController.visit') // --> Go to target's code
Route.get('/:id/count', 'LinksController.getCount') // --> Get Visit count's code
