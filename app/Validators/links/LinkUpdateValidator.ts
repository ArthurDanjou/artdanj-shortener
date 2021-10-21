import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema} from '@ioc:Adonis/Core/Validator'

export default class LinkUpdateValidator {
  constructor (protected ctx: HttpContextContract) {}

  public schema = schema.create({
    target: schema.string.optional({
      trim: true
    }),
    type: schema.enum.optional(
      ['TEMPORARY', 'PERMANENT'] as const
    ),
    expire: schema.date.optional({
      format: 'yyyy-MM-dd HH:mm:ss',
    })
  })

  public messages = {}
}
