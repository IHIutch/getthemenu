import initStripe from 'stripe'

const stripe = initStripe(process.env.STRIPE_SECRET_KEY)

export const createStripeCustomer = async (user) => {
  return await stripe.customers.create(user)
}
