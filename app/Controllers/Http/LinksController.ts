import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from "App/Validators/StoreValidator";
import UpdateValidator from "App/Validators/UpdateValidator";
import Link from "App/Models/Link";

export default class LinksController {

  public async getLink ({params, response, i18n}: HttpContextContract) {
    const code = params.id
    const link = await Link.findByOrFail('code', code)

    if (link.code === code) {
      let visitCount = link.visitCount + 1
      await link.merge({
        visitCount: visitCount
      }).save()
      return response.status(200).redirect(link.target)
    }
    return response.status(404).send({
      message: i18n.formatMessage('messages.no_exists', { code: code })
    })
  }

  public async getAllLinks ({response}: HttpContextContract) {
    const links = await Link.query().orderBy('id', 'asc')
    return response.status(200).send({
      links
    })
  }

  public async getVisitCount ({params, response, i18n}: HttpContextContract) {
    const code = params.id
    const link = await Link.findByOrFail('code', code)

    //Check if code exists
    if (link.code === code) {
      return response.status(200).send({
        count: link.visitCount
      })
    }
    return response.status(404).send({
      message: i18n.formatMessage('messages.no_exists', { code: code })
    })
  }

  public async createLink ({response, request, auth, i18n}: HttpContextContract) {
    await auth.authenticate()
    const link = await Link.create(await request.validate(StoreValidator))
    return response.status(200).send({
      message: i18n.formatMessage('messages.created', { link: link.code, target: link.target })
    })
  }

  public async updateLink ({response, request, auth}: HttpContextContract) {
    await auth.authenticate()
    const link = await Link.findByOrFail('code', request.input('code'))
    const data = await request.validate(UpdateValidator)
    await link.merge({
      target: data.target,
      visitCount: 0
    }).save()
    return response.status(200).send({
      link
    })
  }

  public async deleteLink ({i18n, response, request, auth}: HttpContextContract) {
    await auth.authenticate()
    const code = request.input('code')
    const link = await Link.findByOrFail('code', code)
    await link.delete()
    return response.status(200).send({
      message: i18n.formatMessage('messages.deleted', { link: link.code })
    })
  }

}
