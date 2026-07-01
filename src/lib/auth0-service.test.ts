import { beforeEach, describe, expect, it, vi } from "vitest"

const signupMock = vi.fn()
const loginMock = vi.fn()
const signupAndAuthorizeMock = vi.fn()

vi.mock("auth0-js", () => ({
  default: {
    WebAuth: vi.fn().mockImplementation(function () {
      return {
        signup: signupMock,
        login: loginMock,
        signupAndAuthorize: signupAndAuthorizeMock,
      }
    }),
  },
}))

const stubWindow = (search: string) => {
  const testWindow = {
    location: {
      href: "",
      search,
    },
    top: null,
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
    expect(redirectUrl.hostname).toBe("auth.staging.getport.io")
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
})
