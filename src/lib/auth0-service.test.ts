import { beforeEach, describe, expect, it, vi } from "vitest"

const signupMock = vi.fn()
const loginMock = vi.fn()
const signupAndAuthorizeMock = vi.fn()
const buildAuthorizeUrlMock = vi.fn()

interface MockWebAuth {
  signup: typeof signupMock
  login: typeof loginMock
  signupAndAuthorize: typeof signupAndAuthorizeMock
  client: { buildAuthorizeUrl: typeof buildAuthorizeUrlMock }
  authorize: (options: unknown) => void
}

let lastWebAuth: MockWebAuth

vi.mock("auth0-js", () => ({
  default: {
    WebAuth: vi.fn().mockImplementation(function () {
      const instance: MockWebAuth = {
        signup: signupMock,
        login: loginMock,
        signupAndAuthorize: signupAndAuthorizeMock,
        client: { buildAuthorizeUrl: buildAuthorizeUrlMock },
        authorize: vi.fn(),
      }
      lastWebAuth = instance
      return instance
    }),
  },
}))

const stubWindow = (search: string, withTop = false) => {
  const topWindow = withTop ? { location: { href: "" } } : null
  const testWindow = {
    location: {
      href: "",
      search,
    },
    top: topWindow,
  }

  vi.stubGlobal("window", testWindow)
  return testWindow
}

describe("auth0-service", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it("forwards flag-style ext params to Auth0 authorize redirects", async () => {
    const testWindow = stubWindow("?ext-user-prompt&campaign=launch")
    const { loginWithRedirect } = await import("./auth0-service")

    loginWithRedirect("US", "user@example.com")

    const redirectUrl = new URL(testWindow.location.href)
    expect(redirectUrl.hostname).toBe("auth.us.getport.io")
    expect(redirectUrl.pathname).toBe("/authorize")
    expect(redirectUrl.searchParams.get("ext-user-prompt")).toBe("true")
    expect(redirectUrl.searchParams.get("campaign")).toBeNull()
  })

  it("signs up and starts redirect login with ext params stored as signup metadata", async () => {
    stubWindow("?ext-user-prompt")
    signupMock.mockImplementation((_options, callback) => {
      callback(null, { email: "user@example.com" })
    })
    loginMock.mockImplementation((_options, callback) => {
      callback(null, undefined)
    })
    const { signupWithCredentials } = await import("./auth0-service")

    await signupWithCredentials("US", "user@example.com", "valid-password")

    expect(signupAndAuthorizeMock).not.toHaveBeenCalled()
    expect(signupMock).toHaveBeenCalledWith(
      expect.objectContaining({
        connection: "Username-Password-Authentication",
        email: "user@example.com",
        password: "valid-password",
        userMetadata: {
          user_prompt: "true",
        },
      }),
      expect.any(Function)
    )
    expect(loginMock).toHaveBeenCalledWith(
      expect.objectContaining({
        realm: "Username-Password-Authentication",
        username: "user@example.com",
        password: "valid-password",
        "ext-user-prompt": "true",
      }),
      expect.any(Function)
    )
  })

  it("redirects the parent (top) window after signup login, not the iframe", async () => {
    const testWindow = stubWindow("?ext-user-prompt", true)
    const authorizeUrl =
      "https://auth.staging.getport.io/authorize?login_ticket=T&ext-user-prompt=true"
    buildAuthorizeUrlMock.mockReturnValue(authorizeUrl)
    signupMock.mockImplementation((_options, callback) => {
      callback(null, { email: "user@example.com" })
    })
    loginMock.mockImplementation((_options, callback) => {
      callback(null, undefined)
    })
    const { signupWithCredentials } = await import("./auth0-service")

    await signupWithCredentials("US", "user@example.com", "valid-password")

    // auth0-js completes cross-origin login by calling webAuth.authorize; our
    // override must send that navigation to the top window.
    lastWebAuth.authorize({ loginTicket: "T" })

    expect(buildAuthorizeUrlMock).toHaveBeenCalledWith(
      expect.objectContaining({ loginTicket: "T" })
    )
    expect(testWindow.top?.location.href).toBe(authorizeUrl)
    expect(testWindow.location.href).toBe("")
  })
})
