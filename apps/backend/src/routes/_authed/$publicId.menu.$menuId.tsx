import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/$publicId/menu/$menuId')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>

      <Outlet />
    </div>
  )
}
