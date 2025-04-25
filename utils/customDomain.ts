import {
  deleteVercelDomain,
  getConfigVercelDomain,
  getVercelDomain,
  postVercelDomain,
  postVerifyVercelDomain,
} from './axios/vercel'

// TODO: These functions need to also work with the restaurant model to CRUD and verify domain ownership

export async function verifyCustomDomain(domain: string) {
  return await postVerifyVercelDomain(domain)
}

export async function createCustomDomain(domain: string) {
  return await postVercelDomain(domain)
}

export async function updateCustomDomain(domain: string) {
  // TODO: This probably needs to be updated to delete, then add a new domain. There doesn't seem to be a way to update a domain outright.
  return await postVercelDomain(domain)
}

export async function removeCustomDomain(domain: string) {
  return await deleteVercelDomain(domain)
}

export async function checkCustomDomainAvailability(domain: string) {
  return await getVercelDomain(domain)
}

export async function customDomainCheckConfig(domain: string) {
  return await getConfigVercelDomain(domain)
}

export async function checkCustomDomain(domain: string) {
  const [configResponse, domainResponse] = await Promise.all([
    customDomainCheckConfig(domain),
    checkCustomDomainAvailability(domain),
  ])

  const configJson = await configResponse
  const domainJson = await domainResponse
  if (domainResponse.status !== 200) {
    return domainJson
  }

  /**
   * If domain is not verified, we try to verify now
   */
  let verificationResponse = null
  if (!domainJson.verified) {
    verificationResponse = await customDomainCheckConfig(domain)
  }

  if (verificationResponse && verificationResponse.verified) {
    /**
     * Domain was just verified
     */
    return {
      configured: !configJson.misconfigured,
      ...verificationResponse,
    }
  }

  return {
    configured: !configJson.misconfigured,
    ...domainJson,
    ...(verificationResponse ? { verificationResponse } : {}),
  }
}
