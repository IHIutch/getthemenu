import supabase from '@/utils/supabase'

export const apiGetRestaurants = async (params = {}) => {
  const { similar, ...rest } = params

  const { data, error } = similar
    ? await supabase
        .from('restaurants')
        .select('customHost')
        .ilike('customHost', `%${similar}%`)
    : await supabase.from('restaurants').match(rest)

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiGetRestaurant = async (id) => {
  const { data, error } = await supabase
    .from('restaurants')
    .match({ id })
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiPostRestaurant = async (payload) => {
  const { data, error } = await supabase.from('restaurants').insert(payload)

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiPutRestaurant = async (id, payload) => {
  const { data, error } = await supabase
    .from('restaurants')
    .update(payload)
    .match({ id })
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiDeleteRestaurant = async (id) => {
  const { data, error } = await supabase
    .from('restaurants')
    .delete()
    .match({ id })

  if (error) {
    throw new Error(error.message)
  }
  return data
}
