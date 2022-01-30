import Joi from 'joi'

export const menuItemSchema = Joi.object().keys({
  id: Joi.number().integer().min(1),
  menuId: Joi.number().integer().min(1),
  sectionId: Joi.number().integer().min(1),
  restaurantId: Joi.string(),
  title: Joi.string(),
  price: Joi.number().min(0).allow(null),
  description: Joi.string().empty('').allow(null),
  position: Joi.number().integer().min(0),
  image: Joi.object()
    .keys({
      src: Joi.string(),
      blurDataURL: Joi.string(),
    })
    .allow(null),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date().allow(null),
})

export const menuSchema = Joi.object().keys({
  id: Joi.number().integer().min(1),
  restaurantId: Joi.string(),
  title: Joi.string(),
  slug: Joi.string(),
  position: Joi.number().integer().min(0),
  description: Joi.string().empty('').allow(null),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date().allow(null),
})

export const restaurantSchema = Joi.object().keys({
  id: Joi.string().guid(),
  userId: Joi.string().guid(),
  hours: Joi.object(),
  name: Joi.string(),
  address: Joi.object().keys({
    streetAddress: Joi.string().empty(''),
    city: Joi.string().empty(''),
    state: Joi.string().empty(''),
    zip: Joi.string().empty(''),
  }),
  email: Joi.array().items(Joi.string()),
  phone: Joi.array().items(Joi.string()),
  coverImage: Joi.object()
    .keys({
      src: Joi.string(),
      blurDataURL: Joi.string(),
    })
    .allow(null),
  customHost: Joi.string().empty(''),
  customDomain: Joi.string().empty(''),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date().allow(null),
})

export const sectionSchema = Joi.object().keys({
  id: Joi.number().integer().min(1),
  menuId: Joi.number().integer().min(1),
  restaurantId: Joi.string(),
  title: Joi.string(),
  position: Joi.number().integer().min(0),
  description: Joi.string().empty('').allow(null),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date().allow(null),
})

export const userSchema = Joi.object().keys({
  id: Joi.string(),
  fullName: Joi.string(),
  stripeCustomerId: Joi.string(),
  stripeSubscriptionId: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date().allow(null),
})

export const feedbackSchema = Joi.object().keys({
  id: Joi.number().integer().min(1),
  type: Joi.string(),
  comment: Joi.string(),
  userId: Joi.string().guid(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date().allow(null),
})
