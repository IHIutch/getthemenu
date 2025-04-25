import process from 'node:process'
import axios from 'redaxios'

export async function postVercelDomain(domain: string) {
  const { data } = await axios
    .post(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains`,
      {
        name: domain,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.VERCEL_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    )
    .catch((res) => {
      throw new Error(res.data.error.message)
    })
  return data
}

export async function patchVercelDomain(domain: string) {
  const { data } = await axios
    .patch(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains`,
      {
        name: domain,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.VERCEL_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    )
    .catch((res) => {
      throw new Error(res.data.error.message)
    })
  return data
}

export async function deleteVercelDomain(domain: string) {
  const { data } = await axios
    .delete(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.VERCEL_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    )
    .catch((res) => {
      throw new Error(res.data.error.message)
    })
  return data
}

export async function postVerifyVercelDomain(domain: string) {
  const { data } = await axios
    .post(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}/verify`,
      null,
      {
        headers: {
          'Authorization': `Bearer ${process.env.VERCEL_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    )
    .catch((res) => {
      throw new Error(res.data.error.message)
    })
  return data
}

export async function getVercelDomain(domain: string) {
  const { data } = await axios
    .get(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.VERCEL_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    )
    .catch((res) => {
      throw new Error(res.data.error.message)
    })
  return data
}

export async function getConfigVercelDomain(domain: string) {
  const { data } = await axios
    .get(`https://api.vercel.com/v6/domains/${domain}/config`, {
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
    .catch((res) => {
      console.log({ res })
      throw new Error(res.data.error.message)
    })
  return data
}
