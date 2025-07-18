import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-2">
      <h3>Welcome Home!!!</h3>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  )
}
