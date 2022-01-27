import supabase from '@/utils/supabase'

export const apiGetMenuItems = async (params = {}) => {
  const { data, error } = await supabase
    .from('menuItems')
    .match(params)
    .order('position')

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiGetMenuItem = async (id) => {
  const { data, error } = await supabase
    .from('menuItems')
    .match({ id })
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiPostMenuItem = async (payload) => {
  const { data, error } = await supabase.from('menuItems').insert(payload)

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
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiPutMenuItems = async (payload) => {
  const { data, error } = await supabase.from('menuItems').upsert(payload)

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
