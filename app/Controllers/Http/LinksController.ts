import { HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Link from "App/Models/Link";
import Redis from "@ioc:Adonis/Addons/Redis";
import Click from "App/Models/Click";
import {DateTime} from "luxon";
import LinkUpdateValidator from "App/Validators/links/LinkUpdateValidator";
import LinkStoreValidator from "App/Validators/links/LinkStoreValidator";

export default class LinksController {

  public async visit ({ request, params, response, i18n }: HttpContextContract) {
    const code = params.id
    const link = await Link.findBy('code', code)

    if (!link) {
      return response.status(404).send({
        message: i18n.formatMessage('messages.no_exists', {  code: code })
      })
    }

    if (request.input('json') == '') {
      await link.load('author', (query) => {
        query.select('email')
      })
      return response.status(200).send({
        link
      })
    }

    if (link.code === code) {
      const ip = request.ip()

      if (link.type === 'TEMPORARY' && link.expire! <= DateTime.now()) {
        await link.related('author').dissociate()
        await link.delete()
        return response.status(404).send({
          message: i18n.formatMessage('messages.no_exists', {  code: code })
        })
      }

      const exist = await Redis.get(`${link.code}:${ip}:tracked`)
      if (!exist) {
        await Redis.set(`${link.code}:${ip}:tracked`, 'true', 'ex', '3600')
        const click = await Click.create({
          date: DateTime.now(),
          ip,
          country: ''
        })
        await click.related('link').associate(link)
        await link.related('clicks').save(click)
      }
      return response.redirect(link.target)
    }
  }

  public async index ({ response }: HttpContextContract) {
    const links = await Link
      .query()
      .orderBy('id', 'asc')
      .preload('author', (query) => {
        query.select('email')
      })
    return response.status(200).send({
      links
    })
  }

  public async getCount ({ params, response, i18n }: HttpContextContract) {
    const code = params.id
    const link = await Link.findBy('code', code)

    if (!link) {
      return response.status(404).send({
        message: i18n.formatMessage('messages.no_exists', {  code: code })
      })
    }

    if (link.code === code) {
      return response.status(200).send({
        count: link.clicks.length
      })
    }
  }

  public async store ({ response, request, auth, i18n }: HttpContextContract) {
    await auth.authenticate()
    const link = await Link.create(await request.validate(LinkStoreValidator))
    const user = await auth.user
    await link.related('author').associate(user!)
    return response.status(200).send({
      message: i18n.formatMessage('messages.created', {  link: link.code, target: link.target })
    })
  }

  public async update ({ response, request, auth }: HttpContextContract) {
    await auth.authenticate()
    const link = await Link.findByOrFail('code', request.input('code'))
    const data = await request.validate(LinkUpdateValidator)
    await link.merge(data).save()
    return response.status(200).send({
      link
    })
  }

  public async delete ({ i18n, response, request, auth }: HttpContextContract) {
    await auth.authenticate()
    const code = request.input('code')
    const link = await Link.findByOrFail('code', code)
    await link.related('author').dissociate()
    await link.delete()
    return response.status(200).send({
      message: i18n.formatMessage('messages.deleted', {  link: link.code })
    })
  }

}
