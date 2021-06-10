import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from "App/Validators/StoreValidator";
import UpdateValidator from "App/Validators/UpdateValidator";
import Link from "App/Models/Link";

export default class LinksController {

  public async getLink ({params, response}: HttpContextContract) {
    const code = params.id
    const link = await Link.findByOrFail('code', code)

    if (link.code === code) {
      let visitCount = link.visitCount
      await link.merge({
        visitCount: visitCount++
      }).save()
      return response.redirect(link.target)
    }
    return response.badRequest(`Code does not exist ! (/${code})`)
  }

  public async getAllLinks ({response}: HttpContextContract) {
    const links = await Link.all()
    return response.ok(links);
  }

  public async getVisitCount ({params}: HttpContextContract) {
    const code = params.id
    const link = await Link.findByOrFail('code', code)

    //Check if code exists
    if (link.code === code) {
      return {
        count: link.visitCount
      }
    }
    return {
      message: `Code does not exist ! (${code}`
    }
  }

  public async createLink ({request, auth}: HttpContextContract) {
    await auth.authenticate()
    const link = await Link.create(await request.validate(StoreValidator))
    return {
      message: `Link successfully created : ${link.code} + ${link.target}`
    }
  }

  public async updateLink ({request, auth}: HttpContextContract) {
    await auth.authenticate()
    const link = await Link.findByOrFail('code', request.input('link'))
    const data = await request.validate(UpdateValidator)
    await link.merge(data).save()
    return link
  }

  public async deleteLink ({request, auth}: HttpContextContract) {
    await auth.authenticate()
    const code = request.input('code')
    const link = await Link.findByOrFail('code', code)
    await link.delete()
  }

}
