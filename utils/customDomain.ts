import { createVercelDomain, deleteVercelDomain, getVercelDomain, getVercelDomainConfig, verifyVercelDomain } from './vercel'

export async function updateCustomDomain(domain: string) {
  await deleteVercelDomain(domain)
  return await createVercelDomain(domain)
}

export async function checkCustomDomain(domain: string) {
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
