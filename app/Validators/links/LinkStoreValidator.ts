import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from '@ioc:Adonis/Core/Validator'

export default class LinkStoreValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    code: schema.string({}, [
      rules.unique({table: 'links', column: 'code' }),
      rules.maxLength(10)
    ]),
    target: schema.string({
      trim: true
    }),
    type: schema.enum(
      ['TEMPORARY', 'PERMANENT'] as const
    ),
    expire: schema.date.optional({
      format: 'yyyy-MM-dd HH:mm:ss',
    })
  })

  public messages = {}
}
