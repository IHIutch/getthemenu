import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/onboarding/domain')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/onboarding/domain"!</div>
}
