import supabase from '@/util/supabase'

export const apiGetMenuItems = async (params) => {
  const { data, error } = await supabase
    .from('menuItems')
    .select('*')
    .match(params)
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiGetMenuItem = async (id) => {
  const { data, error } = await supabase
    .from('menuItems')
    .select('*')
    .match({ id })
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiPostMenuItem = async (payload) => {
  const { data, error } = await supabase.from('menuItems').insert([payload])

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiPutMenuItem = async (id, payload) => {
  const { data, error } = await supabase
    .from('menuItems')
    .update(payload)
    .match({ id })
    .select('*')

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiDeleteMenuItem = async (id) => {
  const { data, error } = await supabase
    .from('menuItems')
    .delete()
    .match({ id })

  if (error) {
    throw new Error(error.message)
  }
  return data
}
