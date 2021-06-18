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
    const { default: Logger } = await import('@ioc:Adonis/Core/Logger')
    const { default: Migrator } = await import('@ioc:Adonis/Lucid/Migrator')
    const { default: Database } = await import('@ioc:Adonis/Lucid/Database')
    const { default: Application } = await import('@ioc:Adonis/Core/Application')

    const migrator = new Migrator(Database, Application, {
      direction: 'up',
    })

    await migrator.run()
    if (migrator.status === 'completed') {
      Logger.info('Migrations successfully passed !')
      const { default: User } = await import('App/Models/User')
      const { default: Env } = await import('@ioc:Adonis/Core/Env')
      const user = await User.firstOrCreate({
        email: Env.get('ADMIN_USER', 'admin@linkyjs.dev')
      }, {
        email: Env.get('ADMIN_USER', 'admin@linkyjs.dev'),
        password: Env.get('ADMIN_PASSWORD', 'password')
      })
      if (user) {
        Logger.info('Admin User successfully created !')
      }
    }
  }

  public async shutdown () {
  }
}
