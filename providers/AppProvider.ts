import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
	public static needsApplication = true

  constructor (protected app: ApplicationContract) {
  }

  public register () {
  }

  public async boot () {
  }

  public async ready () {
    const { default: User } = await import('App/Models/User')
    const { default: Env } = await import('@ioc:Adonis/Core/Env')
    const { default: Logger } = await import('@ioc:Adonis/Core/Logger')
    const user = await User.firstOrCreate({
      email: Env.get('ADMIN_USER', 'admin@linkyjs.dev')
    }, {
      email: Env.get('ADMIN_USER', 'admin@linkyjs.dev'),
      password: Env.get('ADMIN_PASSWORD', 'password')
    })
    if (user) {
      Logger.info('User successfully created')
    }
  }

  public async shutdown () {
  }
}
