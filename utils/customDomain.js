import {
  deleteVercelDomain,
  getConfigVercelDomain,
  getVercelDomain,
  postVercelDomain,
  postVerifyVercelDomain,
} from './axios/vercel'

// TODO: These functions need to also work with the restaurant model to CRUD and verify domain ownership

export const verifyCustomDomain = async (domain) => {
  return await postVerifyVercelDomain(domain)
}

export const createCustomDomain = async (domain) => {
  return await postVercelDomain(domain)
}

export const updateCustomDomain = async (domain) => {
  // TODO: This probably needs to be updated to delete, then add a new domain. There doesn't seem to be a way to update a domain outright.
  return await postVercelDomain(domain)
}

export const removeCustomDomain = async (domain) => {
  return await deleteVercelDomain(domain)
}

export const checkCustomDomainAvailability = async (domain) => {
  return await getVercelDomain(domain)
}

export const customDomainCheckConfig = async (domain) => {
  return await getConfigVercelDomain(domain)
}

export const checkCustomDomain = async (domain) => {
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
