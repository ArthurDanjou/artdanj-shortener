import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import UserStoreValidator from "App/Validators/users/UserStoreValidator";
import UserUpdateValidator from "App/Validators/users/UserUpdateValidator";
import Env from "@ioc:Adonis/Core/Env";

export default class UsersController {

  public async index ({ response }: HttpContextContract) {
    return response.status(200).send({
      users: await User.all()
    })
  }

  public async store ({ request, response }: HttpContextContract) {
    const data = await request.validate(UserStoreValidator)
    return response.status(200).send({
      user: await User.create(data)
    })
  }

  public async show ({ params, response }: HttpContextContract) {
    return response.status(200).send({
      user: await User.findOrFail(params.id)
    })
  }

  public async update ({ request, params, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const data = await request.validate(UserUpdateValidator)
    await user.merge(data).save()

    return response.status(200).send({
      user
    })
  }

  public async destroy ({ response, params, auth, i18n }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const admin = await User.findBy('email', Env.get('ADMIN_USER'))

    if (auth.user?.id != admin?.id) {
      return response.unauthorized()
    }

    await user.delete()
    return response.status(200).send({
      message: i18n.formatMessage('messages.user', {
        user: user.email
      })
    })
  }

}
