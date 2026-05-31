import React, { useState } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import type { Region } from "@/lib/auth0-service"
import {
  loginWithGoogle,
  loginWithCredentials,
  sendPasswordResetEmail,
} from "@/lib/auth0-service"
import { RegionToggle } from "./auth/RegionToggle"
import { BrandHeader } from "./auth/BrandHeader"
import { GoogleButton } from "./auth/GoogleButton"

interface LoginFormProps {
  initialEmail?: string
  signupUrl?: string
  defaultRegion?: Region
}

export function LoginForm({
  initialEmail = "",
  signupUrl = "",
  defaultRegion = "US",
}: LoginFormProps) {
  const [region, setRegion] = useState<Region>(defaultRegion)
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isForgotPassword, setIsForgotPassword] = useState(false)

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
      await loginWithCredentials(region, email, password)
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
    setSuccessMessage(null)
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

  const handleSignupClick = () => {
    if (signupUrl) {
      window.location.href = signupUrl
    }
  }

  return (
    <div
      className="relative w-full max-w-[440px] bg-white rounded-[24px] border border-neutral-100 p-8 shadow-xs flex flex-col items-center mx-auto"
      style={{ fontFamily: "'DM Sans Variable', sans-serif" }}
    >
      {/* Region Selector */}
      <RegionToggle region={region} onChange={setRegion} />

      {/* Global Error Banner */}
      {error && (
        <div className="w-full mb-4 mt-6 px-4 py-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-medium text-left leading-relaxed animate-in fade-in duration-200">
          {error}
        </div>
      )}

      {/* Global Success Banner */}
      {successMessage && (
        <div className="w-full mb-4 mt-6 px-4 py-3 bg-green-50 border border-green-100 text-green-700 rounded-xl text-xs font-medium text-left leading-relaxed animate-in fade-in duration-200">
          {successMessage}
        </div>
      )}

      {/* Step 1: Email Form */}
      {step === 1 && !isForgotPassword && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
          <BrandHeader title="Log in to Port" />

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

          {signupUrl && (
            <div className="mt-4 text-sm font-normal text-neutral-600">
              New to Port?{" "}
              <button
                type="button"
                onClick={handleSignupClick}
                className="font-semibold text-neutral-950 hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="w-full flex items-center my-6">
            <div className="flex-1 border-t border-neutral-100" />
            <span className="px-4 text-[11px] font-semibold text-neutral-400 tracking-wider">
              OR
            </span>
            <div className="flex-1 border-t border-neutral-100" />
          </div>

          {/* Google Login */}
          <GoogleButton onClick={handleGoogleLogin} />
        </div>
      )}

      {/* Step 2: Password Form */}
      {step === 2 && !isForgotPassword && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => {
              setStep(1)
              setError(null)
            }}
            className="absolute left-6 top-6 flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <BrandHeader
            title="Enter your password"
            description={
              <>
                Logging in as <span className="font-semibold">{email}</span>
              </>
            }
          />

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
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="text-right mt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true)
                    setError(null)
                    setSuccessMessage(null)
                  }}
                  className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
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
            type="button"
            onClick={() => {
              setIsForgotPassword(false)
              setError(null)
            }}
            className="absolute left-6 top-6 flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to log in</span>
          </button>

          <BrandHeader
            title="Reset password"
            description="Enter your email and we'll send you link instructions to reset your password."
          />

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
