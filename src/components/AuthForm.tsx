import React, { useState, useEffect, useRef } from "react"
import { Eye, EyeOff, ChevronDown, ArrowLeft, Loader2, Check } from "lucide-react"
import type { Region } from "@/lib/auth0-service"
import {
  loginWithGoogle,
  loginWithCredentials,
  signupWithCredentials,
  sendPasswordResetEmail,
} from "@/lib/auth0-service"

// Regional flag components
const USFlag = () => (
  <svg
    width="16"
    height="12"
    viewBox="0 0 20 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="rounded-[2px] shadow-[0_0_1px_rgba(0,0,0,0.3)] shrink-0"
  >
    <rect width="20" height="15" fill="white" />
    <rect width="20" height="1.15" fill="#C8102E" />
    <rect y="2.3" width="20" height="1.15" fill="#C8102E" />
    <rect y="4.6" width="20" height="1.15" fill="#C8102E" />
    <rect y="6.9" width="20" height="1.15" fill="#C8102E" />
    <rect y="9.2" width="20" height="1.15" fill="#C8102E" />
    <rect y="11.5" width="20" height="1.15" fill="#C8102E" />
    <rect y="13.8" width="20" height="1.2" fill="#C8102E" />
    <rect width="8" height="8.05" fill="#012169" />
    <circle cx="1.5" cy="1.5" r="0.3" fill="white" />
    <circle cx="3" cy="1.5" r="0.3" fill="white" />
    <circle cx="4.5" cy="1.5" r="0.3" fill="white" />
    <circle cx="6.5" cy="1.5" r="0.3" fill="white" />
    <circle cx="2" cy="3" r="0.3" fill="white" />
    <circle cx="3.5" cy="3" r="0.3" fill="white" />
    <circle cx="5" cy="3" r="0.3" fill="white" />
    <circle cx="6" cy="3" r="0.3" fill="white" />
    <circle cx="1.5" cy="4.5" r="0.3" fill="white" />
    <circle cx="3" cy="4.5" r="0.3" fill="white" />
    <circle cx="4.5" cy="4.5" r="0.3" fill="white" />
    <circle cx="6.5" cy="4.5" r="0.3" fill="white" />
    <circle cx="2" cy="6" r="0.3" fill="white" />
    <circle cx="3.5" cy="6" r="0.3" fill="white" />
    <circle cx="5" cy="6" r="0.3" fill="white" />
    <circle cx="6" cy="6" r="0.3" fill="white" />
  </svg>
)

const EUFlag = () => (
  <svg
    width="16"
    height="12"
    viewBox="0 0 20 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="rounded-[2px] shadow-[0_0_1px_rgba(0,0,0,0.3)] shrink-0"
  >
    <rect width="20" height="15" fill="#003399" />
    <g fill="#FFCC00" transform="translate(10, 7.5)">
      <circle cx="0" cy="-4" r="0.3" />
      <circle cx="2" cy="-3.46" r="0.3" />
      <circle cx="3.46" cy="-2" r="0.3" />
      <circle cx="4" cy="0" r="0.3" />
      <circle cx="3.46" cy="2" r="0.3" />
      <circle cx="2" cy="3.46" r="0.3" />
      <circle cx="0" cy="4" r="0.3" />
      <circle cx="-2" cy="3.46" r="0.3" />
      <circle cx="-3.46" cy="2" r="0.3" />
      <circle cx="-4" cy="0" r="0.3" />
      <circle cx="-3.46" cy="-2" r="0.3" />
      <circle cx="-2" cy="-3.46" r="0.3" />
    </g>
  </svg>
)

const PortLogo = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <rect width="48" height="48" rx="12" fill="black" />
    <path
      d="M24 34H34V24"
      stroke="white"
      strokeWidth="4.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
    <path
      d="M14 14L28 28"
      stroke="white"
      strokeWidth="4.5"
      strokeLinecap="square"
    />
  </svg>
)

const GoogleLogo = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.707a5.412 5.412 0 010-3.414V4.961H.957a8.997 8.997 0 000 8.078l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.32 0 2.505.453 3.438 1.348l2.58-2.58C13.46 1.09 11.426 0 9 0 5.48 0 2.443 2.029.957 4.961l3.007 2.332c.708-2.127 2.692-3.713 5.036-3.713z"
      fill="#EA4335"
    />
  </svg>
)

interface AuthFormProps {
  initialEmail?: string
  initialMode?: "signUp" | "logIn"
  loginUrl?: string
  signupUrl?: string
  defaultRegion?: Region
}

export function AuthForm({
  initialEmail = "",
  initialMode = "signUp",
  loginUrl = "",
  signupUrl = "",
  defaultRegion = "US",
}: AuthFormProps) {
  const [region, setRegion] = useState<Region>(defaultRegion)
  const [mode, setMode] = useState<"signUp" | "logIn">(initialMode)
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Sync initial configuration changes
  useEffect(() => {
    setEmail(initialEmail)
    setMode(initialMode)
    setRegion(defaultRegion)
    setStep(1)
    setPassword("")
    setError(null)
    setSuccessMessage(null)
    setIsForgotPassword(false)
  }, [initialEmail, initialMode, defaultRegion])

  // Handle click outside dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setRegionDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleRegionChange = (selectedRegion: Region) => {
    setRegion(selectedRegion)
    setRegionDropdownOpen(false)
    setError(null)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }

    if (isForgotPassword) {
      handleForgotPasswordSubmit()
    } else {
      setStep(2)
    }
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    setIsLoading(true)

    try {
      if (mode === "signUp") {
        await signupWithCredentials(region, email, password)
        await loginWithCredentials(region, email, password)
      } else {
        await loginWithCredentials(region, email, password)
      }
    } catch (err: any) {
      console.error(err)
      let displayError = "An unexpected error occurred. Please try again."
      if (err.description) {
        displayError = err.description
      } else if (err.message) {
        displayError = err.message
      }
      setError(displayError)
      setIsLoading(false)
    }
  }

  const handleForgotPasswordSubmit = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const msg = await sendPasswordResetEmail(region, email)
      setSuccessMessage(msg || "Password reset email sent!")
      setIsForgotPassword(false)
    } catch (err: any) {
      console.error(err)
      setError(err.description || err.message || "Failed to send reset email.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setError(null)
    try {
      loginWithGoogle(region)
    } catch (err: any) {
      console.error(err)
      setError("Google Login initialization failed.")
    }
  }

  const handleModeSwitch = (targetMode: "signUp" | "logIn") => {
    setError(null)
    if (targetMode === "logIn") {
      if (loginUrl) {
        window.location.href = loginUrl
      } else {
        setMode("logIn")
      }
    } else {
      if (signupUrl) {
        window.location.href = signupUrl
      } else {
        setMode("signUp")
      }
    }
  }

  return (
    <div
      className="relative w-full max-w-[440px] bg-white rounded-[24px] border border-neutral-100 p-8 shadow-xs flex flex-col items-center mx-auto"
      style={{ fontFamily: "'DM Sans Variable', sans-serif" }}
    >
      {/* US/EU Region Toggle Button */}
      <div ref={dropdownRef} className="absolute left-6 top-6 z-10">
        <button
          onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-sm font-medium text-neutral-700 cursor-pointer shadow-xs"
        >
          {region === "US" ? <USFlag /> : <EUFlag />}
          <span className="tracking-wide">{region}</span>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
        </button>

        {/* Region Dropdown Menu */}
        {regionDropdownOpen && (
          <div className="absolute left-0 mt-1.5 w-32 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-20 animate-in fade-in slide-in-from-top-1 duration-100">
            <button
              onClick={() => handleRegionChange("US")}
              className="w-full px-3 py-2 flex items-center gap-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors text-left cursor-pointer"
            >
              <USFlag />
              <span>US Region</span>
              {region === "US" && (
                <Check className="w-3.5 h-3.5 ml-auto text-neutral-500" />
              )}
            </button>
            <button
              onClick={() => handleRegionChange("EU")}
              className="w-full px-3 py-2 flex items-center gap-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors text-left cursor-pointer"
            >
              <EUFlag />
              <span>EU Region</span>
              {region === "EU" && (
                <Check className="w-3.5 h-3.5 ml-auto text-neutral-500" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Port Logo */}
      <div className="mt-8 mb-6">
        <PortLogo />
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="w-full mb-4 px-4 py-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-medium text-left leading-relaxed animate-in fade-in duration-200">
          {error}
        </div>
      )}

      {/* Global Success Banner */}
      {successMessage && (
        <div className="w-full mb-4 px-4 py-3 bg-green-50 border border-green-100 text-green-700 rounded-xl text-xs font-medium text-left leading-relaxed animate-in fade-in duration-200">
          {successMessage}
        </div>
      )}

      {/* Step 1: Email Form */}
      {step === 1 && !isForgotPassword && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
          <h2 className="text-[28px] font-semibold text-neutral-900 tracking-tight mb-2 text-center">
            {mode === "signUp" ? "Sign up to Port" : "Log in to Port"}
          </h2>

          {mode === "signUp" && (
            <p className="text-sm text-neutral-500 font-normal leading-relaxed text-center mb-6 max-w-[280px]">
              Free forever, no trial period. Credit cards not required.
            </p>
          )}

          <form onSubmit={handleEmailSubmit} className="w-full mt-2">
            <div className="w-full mb-4 text-left">
              <label className="block text-sm font-medium text-neutral-500 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-normal text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all shadow-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 active:translate-y-px transition-all rounded-xl text-white font-medium text-center text-sm cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              Continue
            </button>
          </form>

          <div className="mt-4 text-sm font-normal text-neutral-600">
            {mode === "signUp" ? (
              <>
                Already a user?{" "}
                <button
                  onClick={() => handleModeSwitch("logIn")}
                  className="font-semibold text-neutral-950 hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                New to Port?{" "}
                <button
                  onClick={() => handleModeSwitch("signUp")}
                  className="font-semibold text-neutral-950 hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          {/* Google Social Divider */}
          <div className="w-full flex items-center my-6">
            <div className="flex-1 border-t border-neutral-100" />
            <span className="px-4 text-[11px] font-semibold text-neutral-400 tracking-wider">
              OR
            </span>
            <div className="flex-1 border-t border-neutral-100" />
          </div>

          {/* Google OAuth Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 border border-neutral-200 bg-white hover:bg-neutral-50 active:translate-y-px transition-all rounded-xl text-neutral-700 font-medium text-sm cursor-pointer shadow-xs flex items-center justify-center gap-2.5"
          >
            <GoogleLogo />
            <span>Continue with Google</span>
          </button>

          {/* Privacy Disclaimer (Signup Only) */}
          {mode === "signUp" && (
            <p className="mt-8 text-xs text-neutral-400 text-center leading-relaxed font-normal max-w-[310px]">
              By signing up to Port, you accept our{" "}
              <a
                href="https://www.getport.io/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-neutral-600"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://www.getport.io/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-neutral-600"
              >
                Privacy Policy
              </a>
              .
            </p>
          )}
        </div>
      )}

      {/* Step 2: Password Form */}
      {step === 2 && !isForgotPassword && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
          {/* Back Button */}
          <button
            onClick={() => {
              setStep(1)
              setError(null)
            }}
            className="absolute left-6 top-6 flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <h2 className="text-[28px] font-semibold text-neutral-900 tracking-tight mb-2 text-center mt-6">
            {mode === "signUp" ? "Create a password" : "Enter your password"}
          </h2>

          <p className="text-xs text-neutral-500 font-normal leading-normal text-center mb-6">
            Logging in as <span className="font-semibold">{email}</span>
          </p>

          <form onSubmit={handleCredentialsSubmit} className="w-full mt-2">
            <div className="w-full mb-4 text-left relative">
              <label className="block text-sm font-medium text-neutral-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-normal text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer p-0.5"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {mode === "logIn" && (
                <div className="text-right mt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true)
                      setError(null)
                    }}
                    className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 active:translate-y-px transition-all rounded-xl text-white font-medium text-center text-sm cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : mode === "signUp" ? (
                "Create Account"
              ) : (
                "Log In"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Forgot Password View */}
      {isForgotPassword && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
          {/* Back Button */}
          <button
            onClick={() => {
              setIsForgotPassword(false)
              setError(null)
            }}
            className="absolute left-6 top-6 flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to log in</span>
          </button>

          <h2 className="text-[28px] font-semibold text-neutral-900 tracking-tight mb-2 text-center mt-6">
            Reset password
          </h2>

          <p className="text-sm text-neutral-500 font-normal leading-relaxed text-center mb-6 max-w-[280px]">
            Enter your email and we'll send you link instructions to reset your password.
          </p>

          <form onSubmit={handleEmailSubmit} className="w-full mt-2">
            <div className="w-full mb-4 text-left">
              <label className="block text-sm font-medium text-neutral-500 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-normal text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all shadow-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 active:translate-y-px transition-all rounded-xl text-white font-medium text-center text-sm cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending email...</span>
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
