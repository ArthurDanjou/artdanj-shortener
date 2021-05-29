import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from "@ioc:Adonis/Core/HealthCheck";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";

const BASE_URL = Env.get('APP_URL')

Route.get('/', async ({response}: HttpContextContract) => {
  return response.status(200).send({
    domain: BASE_URL,
    version: Env.get('APP_VERSION'),
    source: `${BASE_URL}/source`,
    healthCheck: `${BASE_URL}/health`,
    links: `${BASE_URL}/links`
  })
})

Route.get('/source', async ({response}: HttpContextContract) => {
  return response.redirect('https://github.com/arthurdanjou/artclick')
})

Route.get('health', async ({response}: HttpContextContract) => {
  const report = await HealthCheck.getReport()
  const isLive = await HealthCheck.isLive()
  const isReady = await HealthCheck.isReady()
  return report.healthy ? response.ok({ isLive, isReady, report: report.report }) : response.badRequest({ isLive, isReady, report: report.report })
})

Route
  .group(() => {
    Route.post('/login', 'UsersController.login')
    Route.post('/logout', 'UsersController.logout')
    Route.post('/token', 'UsersController.createInfiniteToken')
  })
  .prefix('auth')

Route
  .group(() => {
    Route.post('/create', 'LinksController.createLink')
    Route.post('/update', 'LinksController.updateLink')
    Route.post('/delete', 'LinksController.deleteLink')
  })
  .prefix('options')
  .middleware('auth')

Route.get('/links', 'LinksController.getAllLinks') // --> Home
Route.get('/:id', 'LinksController.getLink') // --> Go to target's code
Route.get('/:id/count', 'LinksController.getVisitCount') // --> Get Visit count's code
