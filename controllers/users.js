import supabase from '@/utils/supabase'

export const apiPostRegisterUser = async (payload) => {
  const { data, error } = await supabase.from('users').insert(payload)

  if (error) throw new Error(error.message)
  return data
}

export const apiGetUser = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select(
      `*, restaurants (
        id
      ) `
    )
    .match({ id })
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiPostUser = async (payload) => {
  const { data, error } = await supabase.from('users').insert(payload)

  if (error) {
    throw new Error(error)
  }
  return data
}

export const apiPutUser = async (id, payload) => {
  const { data, error } = await supabase
    .from('users')
    .update(payload)
    .match({ id })
    .single()

  if (error) {
    throw new Error(error)
  }
  return data
}

export const apiPostForgotPassword = () => {}

export const apiPostUpdatePassword = () => {}
