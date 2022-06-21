import {
  deleteVercelDomain,
  getConfigVercelDomain,
  getVercelDomain,
  postVercelDomain,
  postVerifyVercelDomain,
} from './axios/vercel'

export const vercelVerifyDomain = async (domain) => {
  return await postVerifyVercelDomain(domain)
}

export const vercelAddDomain = async (domain) => {
  return await postVercelDomain(domain)
}

export const vercelUpdateDomain = async (domain) => {
  // TODO: This probably needs to be updated to delete, then add a new domain. There doesn't seem to be a way to update a domain outright.
  return await postVercelDomain(domain)
}

export const vercelRemoveDomain = async (domain) => {
  return await deleteVercelDomain(domain)
}

export const vercelCheckDomainAvailability = async (domain) => {
  return await getVercelDomain(domain)
}

export const vercelCheckDomainConfig = async (domain) => {
  return await getConfigVercelDomain(domain)
}

export const vercelCheckDomain = async (domain) => {
  const [configResponse, domainResponse] = await Promise.all([
    vercelCheckDomainConfig(domain),
    vercelCheckDomainAvailability(domain),
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
    verificationResponse = await vercelCheckDomainConfig(domain)
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
