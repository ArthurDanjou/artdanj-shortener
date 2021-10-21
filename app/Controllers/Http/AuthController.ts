import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";

export default class AuthController {

  public async login ({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '2 days'
    })
    return response.status(200).send({
      token: token.toJSON()
    })
  }

  public async token ({ response, request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    const token = await auth.use('api').attempt(email, password)
    return response.status(200).send({
      token: token.toJSON()
    })
  }

  public async logout ({ response, auth, i18n }: HttpContextContract) {
    await auth.use('api').revoke()
    return response.status(200).send({
      message: i18n.formatMessage('messages.logout')
    })
  }

  public async me ({ response, auth }: HttpContextContract) {
    await auth.authenticate()
    return response.status(200).send({
      user: auth.user
    })
  }

}
