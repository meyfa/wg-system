import Joi from 'joi'

/**
 * The validator to be used for ids. Note that the required flag is not set here,
 * only type is specified.
 */
export const idValidator = Joi.string()
