import Joi from 'joi'

export const menuItemSchema = Joi.object().keys({
  id: Joi.number().integer().min(1),
  menuId: Joi.number().integer().min(1),
  sectionId: Joi.number().integer().min(1),
  restaurantId: Joi.string(),
  title: Joi.string(),
  price: Joi.number().min(0),
  description: Joi.string(),
  position: Joi.number().integer().min(0),
  image: Joi.object().keys({
    src: Joi.string(),
    blurDataURL: Joi.string(),
  }),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date(),
})

export const menuSchema = Joi.object().keys({
  id: Joi.number().integer().min(1),
  restaurantId: Joi.string(),
  title: Joi.string(),
  slug: Joi.string(),
  position: Joi.number().integer().min(0),
  description: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date(),
})

export const restaurantSchema = Joi.object().keys({
  id: Joi.number().integer().min(1),
  userId: Joi.number().integer().min(1),
  hours: Joi.object(),
  name: Joi.string(),
  address: Joi.object().keys({
    streetAddress: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zip: Joi.string(),
  }),
  email: Joi.array().items(Joi.string()),
  phone: Joi.array().items(Joi.string()),
  coverImage: Joi.object().keys({
    src: Joi.string(),
    blurDataURL: Joi.string(),
  }),
  customHost: Joi.string(),
  customDomain: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date(),
})

export const sectionSchema = Joi.object().keys({
  id: Joi.number().integer().min(1),
  menuId: Joi.number().integer().min(1),
  restaurantId: Joi.string(),
  title: Joi.string(),
  position: Joi.number().integer().min(0),
  description: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date(),
})

export const userSchema = Joi.object().keys({
  id: Joi.string(),
  fullName: Joi.string(),
  stripeCustomerId: Joi.string(),
  stripeSubscriptionId: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date(),
})
