import { Vercel } from '@vercel/sdk'

import { env } from '../env'
import { getErrorMessage } from '../functions'

const vercel = new Vercel({
  bearerToken: env.VERCEL_SDK_TOKEN,
})

export async function getVercelDomain(domain: string) {
  try {
    const data = await vercel.projects.getProjectDomain({
      idOrName: env.VERCEL_PROJECT_ID,
      domain,
    })
    return data
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function createVercelDomain(domain: string) {
  try {
    const data = await vercel.projects.addProjectDomain({
      idOrName: env.VERCEL_PROJECT_ID,
      requestBody: {
        name: domain,
      },
    })
    return data
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function deleteVercelDomain(domain: string) {
  try {
    return await vercel.projects.removeProjectDomain({
      idOrName: env.VERCEL_PROJECT_ID,
      domain,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function verifyVercelDomain(domain: string) {
  try {
    const data = await vercel.projects.verifyProjectDomain({
      idOrName: env.VERCEL_PROJECT_ID,
      domain,
    })
    return data
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getVercelDomainConfig(domain: string) {
  try {
    const data = await vercel.domains.getDomainConfig({
      domain,
    })
    return data
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function updateVercelDomain(domain: string) {
  await deleteVercelDomain(domain)
  return await createVercelDomain(domain)
}

export async function checkVercelDomain(domain: string) {
  const [configResponse, domainResponse] = await Promise.all([
    getVercelDomainConfig(domain),
    getVercelDomain(domain),
  ])

  /**
   * If domain is not verified, we try to verify now
   */
  let verificationResponse = null
  if (!domainResponse.verified) {
    verificationResponse = await verifyVercelDomain(domain)
  }

  if (verificationResponse?.verified) {
    /**
     * Domain was just verified
     */
    return {
      configured: !configResponse.misconfigured,
      ...verificationResponse,
    }
  }

  return {
    configured: !configResponse.misconfigured,
    ...domainResponse,
    ...(verificationResponse ? { verificationResponse } : {}),
  }
}
