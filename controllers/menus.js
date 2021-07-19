import supabase from '@/utils/supabase'

export const apiGetMenus = async (params = null) => {
  const { data, error } = await supabase.from('menus').select('*').match(params)

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiGetMenu = async (id) => {
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .match({ id })
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiPostMenu = async (payload) => {
  const { data, error } = await supabase.from('menus').insert([payload])

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiPutMenu = async (id, payload) => {
  const { data, error } = await supabase
    .from('menus')
    .update(payload)
    .match({ id })
    .select('*')

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiDeleteMenu = async (id) => {
  const { data, error } = await supabase.from('menus').delete().match({ id })

  if (error) {
    throw new Error(error.message)
  }
  return data
}
