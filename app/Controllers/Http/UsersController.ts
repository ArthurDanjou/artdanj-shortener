import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {

  public async login ({request, auth}: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '2 days'
    })
    return token.toJSON()
  }

  public async createInfiniteToken ({request, auth}: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    const token = await auth.use('api').attempt(email, password)
    return token.toJSON()
  }

  public async logout ({auth}: HttpContextContract) {
    await auth.use('api').revoke()
    return { message: 'Vous avez été déconnecté' }
  }

}
