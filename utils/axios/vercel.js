import axios from 'redaxios'

export const postVercelDomain = async (domain) => {
  const { data } = await axios
    .post(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains`,
      {
        name: domain,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .catch((res) => {
      throw new Error(res.data.error.message)
    })
  return data
}

export const patchVercelDomain = async (domain) => {
  const { data } = await axios
    .patch(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains`,
      {
        name: domain,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .catch((res) => {
      throw new Error(res.data.error.message)
    })
  return data
}

export const deleteVercelDomain = async (domain) => {
  const { data } = await axios
    .delete(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .catch((res) => {
      throw new Error(res.data.error.message)
    })
  return data
}

export const postVerifyVercelDomain = async (domain) => {
  const { data } = await axios
    .post(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}/verify`,
      null,
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .catch((res) => {
      throw new Error(res.data.error.message)
    })
  return data
}

export const getAvailabilityVercelDomain = async (domain) => {
  const { data } = await axios
    .get(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .catch((res) => {
      throw new Error(res.data.error.message)
    })
  return data
}

export const getConfigVercelDomain = async (domain) => {
  const { data } = await axios
    .get(`https://api.vercel.com/v6/domains/${domain}/config`, {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
    .catch((res) => {
      console.log({ res })
      throw new Error(res.data.error.message)
    })
  return data
}
