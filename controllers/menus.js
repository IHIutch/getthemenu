import supabase from '@/utils/supabase'

export const apiGetMenus = async (params = {}) => {
  const { similar, ...rest } = params

  const { data, error } = similar
    ? await supabase
        .from('menus')
        .select('slug')
        .match({ restaurantId: rest.restaurantId })
        .ilike('slug', `%${similar}%`)
    : await supabase.from('menus').match(rest).order('position')

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiGetMenu = async (id) => {
  const { data, error } = await supabase.from('menus').match({ id }).single()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiPostMenu = async (payload) => {
  const { data, error } = await supabase.from('menus').insert(payload)

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
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiPutMenus = async (payload) => {
  const { data, error } = await supabase.from('menus').upsert(payload)

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
