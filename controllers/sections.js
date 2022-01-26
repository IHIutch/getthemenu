import supabase from '@/utils/supabase'

export const apiGetSections = async (params = {}) => {
  const { data, error } = await supabase
    .from('sections')
    .match(params)
    .select('*')
    .order('position')

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiGetSection = async (id) => {
  const { data, error } = await supabase
    .from('sections')
    .match({ id })
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiPostSection = async (payload) => {
  const { data, error } = await supabase.from('sections').insert([payload])

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiPutSection = async (id, payload) => {
  const { data, error } = await supabase
    .from('sections')
    .update(payload)
    .match({ id })
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiPutSections = async (payload) => {
  const { data, error } = await supabase.from('sections').upsert(payload)

  if (error) {
    throw new Error(error.message)
  }
  return data
}

export const apiDeleteSection = async (id) => {
  const { data, error } = await supabase.from('sections').delete().match({ id })

  if (error) {
    throw new Error(error.message)
  }
  return data
}
