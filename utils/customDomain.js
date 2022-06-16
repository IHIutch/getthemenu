import axios from 'redaxios'

export const vercelVerifyDomain = async (domain) => {
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

export const vercelAddDomain = async (domain) => {
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
      // if (data.error?.code === 'forbidden') {
      //     res.status(resStatusType.FORBIDDEN).end()
      //   } else if (data.error?.code === 'domain_taken') {
      //     res.status(resStatusType.CONFLICT).end()
      //   }

      throw new Error(res.data.error.message)
    })
  return data
}

export const vercelRemoveDomain = async (domain) => {
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

export const vercelCheckDomainAvailability = async (domain) => {
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

export const vercelCheckDomainConfig = async (domain) => {
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
