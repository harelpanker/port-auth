import auth0 from "auth0-js"

export type Region = "EU" | "US"

export interface RegionConfig {
  clientId: string
  domain: string
  redirectUri: string
}

export const REGION_CONFIGS: Record<Region, RegionConfig> = {
  EU: {
    clientId: "dAea4bpVXnr0ohLCdLKWgIgtC22sSSWl",
    domain: "auth.staging.getport.io",
    redirectUri: "https://app.stg-01.port.io",
  },
  US: {
    clientId: "dAea4bpVXnr0ohLCdLKWgIgtC22sSSWl",
    domain: "auth.staging.getport.io",
    redirectUri: "https://app.stg-01.port.io",
  },
}

// auth0.loginWithPopup({ authorizationParams: { 'ext-my_custom_param': 'your_custom_value' } });

/**
 * Creates an instance of the Auth0 WebAuth client for a specific region.
 */
export function getWebAuth(region: Region): auth0.WebAuth {
  const config = REGION_CONFIGS[region]
  return new auth0.WebAuth({
    domain: config.domain,
    clientID: config.clientId,
    redirectUri: config.redirectUri,
    responseType: "token",
    scope: "openid profile email",
  })
}

function appendExtParams(params: URLSearchParams): void {
  new URLSearchParams(window.location.search).forEach((value, key) => {
    if (key.startsWith("ext-")) params.set(key, value)
  })
}

function buildState(state?: Record<string, string>): string | null {
  const iframeParams: Record<string, string> = {}
  new URLSearchParams(window.location.search).forEach((value, key) => {
    iframeParams[key] = value
  })
  const merged = { ...iframeParams, ...state }
  return Object.keys(merged).length > 0
    ? new URLSearchParams(merged).toString()
    : null
}

function redirectTop(url: string): void {
  try {
    const target = window.top && window.top !== window ? window.top : window
    target.location.href = url
  } catch {
    window.location.href = url
  }
}

/**
 * Redirects to Auth0's authorize endpoint for standard redirect-based login.
 * Targets window.top so the entire page navigates when called from inside an iframe.
 * Automatically includes the iframe's current URL params in the state.
 */
export function loginWithRedirect(
  region: Region,
  loginHint?: string,
  state?: Record<string, string>
): void {
  const config = REGION_CONFIGS[region]
  const params = new URLSearchParams({
    response_type: "token",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: "openid profile email",
  })
  if (loginHint) params.set("login_hint", loginHint)
  appendExtParams(params)
  const builtState = buildState(state)
  if (builtState) params.set("state", builtState)
  redirectTop(`https://${config.domain}/authorize?${params.toString()}`)
}

/**
 * Initiates the Google OAuth2 social login flow.
 * Targets window.top so the entire page navigates when called from inside an iframe.
 * Automatically includes the iframe's current URL params in the state.
 */
export function loginWithGoogle(
  region: Region,
  state?: Record<string, string>
): void {
  const config = REGION_CONFIGS[region]
  const params = new URLSearchParams({
    response_type: "token",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: "openid profile email",
    connection: "google-oauth2",
  })
  appendExtParams(params)
  const builtState = buildState(state)
  if (builtState) params.set("state", builtState)
  redirectTop(`https://${config.domain}/authorize?${params.toString()}`)
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
