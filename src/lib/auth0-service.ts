import auth0 from "auth0-js"

export type Region = "EU" | "US"

export interface RegionConfig {
  clientId: string
  domain: string
  redirectUri: string
}

export const REGION_CONFIGS: Record<Region, RegionConfig> = {
  EU: {
    clientId: "96IeqL36Q0UIBxIfV1oqOkDWU6UslfDj",
    domain: "port-prod.eu.auth0.com",
    redirectUri: "https://app.port.io",
  },
  US: {
    clientId: "4lHUry3Gkds317lQ3JcgABh0JPbT3rWx",
    domain: "port-prod.us.auth0.com",
    redirectUri: "https://app.us.port.io",
  },
}

/**
 * Creates an instance of the Auth0 WebAuth client for a specific region.
 */
export function getWebAuth(region: Region): auth0.WebAuth {
  const config = REGION_CONFIGS[region]
  return new auth0.WebAuth({
    domain: config.domain,
    clientID: config.clientId,
    redirectUri: config.redirectUri,
    responseType: "code",
    scope: "openid profile email",
  })
}

/**
 * Redirects to Auth0's authorize endpoint for standard redirect-based login.
 * Targets window.top so the entire page navigates when called from inside an iframe.
 */
export function loginWithRedirect(region: Region, loginHint?: string): void {
  const config = REGION_CONFIGS[region]
  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: "openid profile email",
  })
  if (loginHint) {
    params.set("login_hint", loginHint)
  }
  const url = `https://${config.domain}/authorize?${params.toString()}`
  try {
    const target = window.top && window.top !== window ? window.top : window
    target.location.href = url
  } catch {
    window.location.href = url
  }
}

/**
 * Initiates the Google OAuth2 social login flow.
 * Targets window.top so the entire page navigates when called from inside an iframe.
 * Google blocks OAuth flows that originate from iframes.
 */
export function loginWithGoogle(region: Region): void {
  const config = REGION_CONFIGS[region]
  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: "openid profile email",
    connection: "google-oauth2",
  })
  const url = `https://${config.domain}/authorize?${params.toString()}`
  try {
    const target = window.top && window.top !== window ? window.top : window
    target.location.href = url
  } catch {
    window.location.href = url
  }
}

/**
 * Performs database-based credentials login using cross-origin authentication.
 */
export function loginWithCredentials(
  region: Region,
  email: string,
  password: string
): Promise<void> {
  const webAuth = getWebAuth(region)
  return new Promise((resolve, reject) => {
    webAuth.login(
      {
        realm: "Username-Password-Authentication",
        username: email,
        password: password,
      },
      (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })
}

/**
 * Signs up a new user with email and password.
 */
export function signupWithCredentials(
  region: Region,
  email: string,
  password: string
): Promise<any> {
  const webAuth = getWebAuth(region)
  return new Promise((resolve, reject) => {
    webAuth.signup(
      {
        connection: "Username-Password-Authentication",
        email,
        password,
      },
      (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      }
    )
  })
}

/**
 * Sends a password reset email to the user.
 */
export function sendPasswordResetEmail(
  region: Region,
  email: string
): Promise<string> {
  const webAuth = getWebAuth(region)
  return new Promise((resolve, reject) => {
    webAuth.changePassword(
      {
        connection: "Username-Password-Authentication",
        email: email,
      },
      (err, resp) => {
        if (err) {
          reject(err)
        } else {
          resolve(resp || "Password reset email sent")
        }
      }
    )
  })
}
