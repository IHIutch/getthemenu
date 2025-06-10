import { createFileRoute, redirect } from '@tanstack/react-router'

import { fetchUser } from '../_authed'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
  beforeLoad: async () => {
    const user = await fetchUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    throw redirect({
      to: '/$publicId/dashboard',
      params: {
        publicId: user.restaurants[0].publicId,
      },
    })
  },
})

function RouteComponent() {
  return <div>Hello "/auth/login"!</div>
}
