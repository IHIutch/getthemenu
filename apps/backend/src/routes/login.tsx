import { Box, Button, Field, Heading, Input, VStack } from '@chakra-ui/react'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { useMutation } from '../hooks/use-mutation'
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

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutate({
        data: {
          email: value.email,
          password: value.password,
        },
      })
    },
  })

  return (
    <div>
      <Box maxW="md" mx="auto" mt={8} p={4} borderWidth={1} rounded="sm" shadow="sm">
        <Box mb={4}>
          <Heading as="h1" size="xl">Login</Heading>
        </Box>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <VStack gap={4}>
            <form.Field
              name="email"
              children={field => (
                <Field.Root invalid={!!field.state.meta.errors.length} required>
                  <Field.Label>
                    Email
                  </Field.Label>
                  <Input
                    type="text"
                    name={field.name}
                    onChange={e => field.handleChange(e.target.value)}
                  />
                  <Field.ErrorText>{field.state.meta.errors?.[0]}</Field.ErrorText>
                </Field.Root>
              )}
            />

            <form.Field
              name="password"
              children={field => (
                <Field.Root invalid={!!field.state.meta.errors.length} required>
                  <Field.Label>
                    Password
                  </Field.Label>
                  <Input
                    type="password"
                    name={field.name}
                    onChange={e => field.handleChange(e.target.value)}
                  />
                  <Field.ErrorText>{field.state.meta.errors?.[0]}</Field.ErrorText>
                </Field.Root>
              )}
            />
            <form.Subscribe
              selector={state => ({ isSubmitting: state.isSubmitting })}
              children={({ isSubmitting }) => (
                <Button
                  type="submit"
                  loading={isSubmitting}
                >
                  Login
                </Button>
              )}
            />
          </VStack>
        </form>
      </Box>
    </div>
  )
}
