import { createFileRoute, useRouter } from '@tanstack/react-router'

import { useMutation } from '~/hooks/use-mutation'

import { loginFn } from './_authed'

export const Route = createFileRoute('/login')({
  component: LoginComp,
})

function LoginComp() {
  const router = useRouter()

  const loginMutation = useMutation({
    fn: loginFn,
    onSuccess: async (ctx) => {
      if (!ctx.data?.error) {
        await router.invalidate()
        router.navigate({
          to: '/auth/login',
          params: {
            publicId: '',
          },
        })
      }
    },
  })

  return (
    <div className="fixed inset-0 bg-white dark:bg-black flex items-start justify-center p-8">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()

            const formData = new FormData(e.target as HTMLFormElement)

            loginMutation.mutate({
              data: {
                email: formData.get('email') as string,
                password: formData.get('password') as string,
              },
            })
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="block text-xs">
              Username
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="px-2 py-1 w-full rounded border border-gray-500/20 bg-white dark:bg-gray-800"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="px-2 py-1 w-full rounded border border-gray-500/20 bg-white dark:bg-gray-800"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white rounded py-2 font-black uppercase"
            disabled={loginMutation.status === 'pending'}
          >
            {loginMutation.status === 'pending' ? '...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
