import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import User from "../app/Models/User";
import Env from "@ioc:Adonis/Core/Env";

export default class AppProvider {
	public static needsApplication = true

  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    await User.firstOrCreate({
      email: Env.get('ADMIN_USER', 'admin@linkyjs.dev')
    }, {
      email: Env.get('ADMIN_USER', 'admin@linkyjs.dev'),
      password: Env.get('ADMIN_PASSWORD', 'password')
    })
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
