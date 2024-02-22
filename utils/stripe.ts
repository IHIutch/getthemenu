import Stripe from 'stripe'
import { env } from './env'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export const createStripeCustomer = async (user: Stripe.CustomerCreateParams) => {
  return await stripe.customers.create(user)
}

export const createStripeBillingSession = async (stripeCustomerId: Stripe.Customer['id']) => {
  return await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${env.BASE_URL}/account`,
  })
}

export const createStripeCheckoutSession = async (
  stripeCustomerId: Stripe.Customer['id'],
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]
) => {
  return await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: lineItems,
    success_url: `${env.BASE_URL}/account?checkout=success`,
    cancel_url: `${env.BASE_URL}/account?checkout=cancel`,
  })
}
