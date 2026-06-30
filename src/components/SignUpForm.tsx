import React, { useState } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import type { Region } from "@/lib/auth0-service"
import {
  loginWithGoogle,
  signupWithCredentials,
} from "@/lib/auth0-service"
import { RegionToggle } from "./auth/RegionToggle"
import { BrandHeader } from "./auth/BrandHeader"
import { GoogleButton } from "./auth/GoogleButton"
import { TermsDisclaimer } from "./auth/TermsDisclaimer"
import { Button } from "./ui/button"

interface SignUpFormProps {
  initialEmail?: string
  loginUrl?: string
  defaultRegion?: Region
  state?: Record<string, string>
}

interface PasswordRule {
  verified?: boolean
  message?: string
  format?: unknown[]
}

interface AuthErrorLike {
  code?: string
  name?: string
  description?: string | { rules?: PasswordRule[] }
  friendly_message?: string
  message?: string
}

function isAuthErrorLike(err: unknown): err is AuthErrorLike {
  return typeof err === "object" && err !== null
}

export function SignUpForm({
  initialEmail = "",
  loginUrl = "",
  defaultRegion = "US",
  state,
}: SignUpFormProps) {
  const [region, setRegion] = useState<Region>(defaultRegion)
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }

    setStep(2)
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!password || password.length < 12) {
      setError("Password must be at least 12 characters long.")
      return
    }

    setIsLoading(true)

    try {
      await signupWithCredentials(region, email, password, state)
    } catch (err: unknown) {
      console.error(err)
      const authError = isAuthErrorLike(err) ? err : {}
      let displayError = "An unexpected error occurred. Please try again."
      if (
        authError.code === "invalid_password" ||
        authError.name === "PasswordStrengthError"
      ) {
        const rules =
          typeof authError.description === "object"
            ? (authError.description.rules ?? [])
            : []
        const failed = rules.filter((r) => !r.verified)
        if (failed.length > 0) {
          displayError = failed.map((r) => {
            let msg: string = r.message ?? ""
            const format = r.format ?? []
            format.forEach((val) => {
              msg = msg.replace("%d", String(val))
            })
            return msg
          }).join(" ")
        } else {
          displayError = "Password is too weak. Please choose a stronger password."
        }
      } else if (typeof authError.friendly_message === "string") {
        displayError = authError.friendly_message
      } else if (
        typeof authError.description === "string" &&
        !authError.description.includes("_")
      ) {
        displayError = authError.description
      } else if (authError.message) {
        displayError = authError.message
      }
      setError(displayError)
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setError(null)
    try {
      loginWithGoogle(region, state)
    } catch (err: unknown) {
      console.error(err)
      setError("Google Login initialization failed.")
    }
  }

  const handleLoginClick = () => {
    if (loginUrl) {
      window.location.href = loginUrl
    }
  }

  return (
    <div className="relative flex w-full flex-col px-9 py-10">
      {/* Region Selector */}
      <RegionToggle region={region} onChange={setRegion} />

      {/* Global Error Banner */}
      {error && (
        <div className="mt-6 mb-4 w-full animate-in rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-left text-xs leading-relaxed font-medium text-red-700 duration-200 fade-in">
          {error}
        </div>
      )}

      {/* Step 1: Email Form */}
      {step === 1 ? (
        <div className="flex w-full animate-in flex-col duration-200 fade-in">
          <BrandHeader
            title="Sign up to Port"
            description="Free forever, no trial period. Credit cards not required."
          />

          <form
            onSubmit={handleEmailSubmit}
            className="flex w-full flex-col gap-y-4 pt-6"
          >
            <div className="flex w-full flex-col gap-y-2 text-left">
              <label className="text-sm text-black/60">Email address</label>
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#D3D3D3] bg-white px-4 py-3 text-sm placeholder-black/60 transition-all outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <Button
              type="submit"
              className="h-auto rounded-xl py-3.5 font-medium transition"
            >
              Continue
            </Button>
          </form>

          {loginUrl && (
            <div className="my-4 text-sm text-black/60">
              Already a user?{" "}
              <button
                type="button"
                onClick={handleLoginClick}
                className="cursor-pointer font-semibold text-black hover:underline"
              >
                Log in
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="mb-6 flex w-full items-center">
            <div className="flex-1 border-t border-[#E3E3E3]" />
            <span className="px-4 text-sm text-black/60">OR</span>
            <div className="flex-1 border-t border-[#E3E3E3]" />
          </div>

          {/* Google Login */}
          <GoogleButton onClick={handleGoogleLogin} />

          {/* Footer Terms */}
          <TermsDisclaimer />
        </div>
      ) : (
        /* Step 2: Password Form */
        <div className="flex w-full animate-in flex-col items-center duration-200 fade-in">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => {
              setStep(1)
              setError(null)
            }}
            className="absolute top-6 left-6 flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-neutral-500 transition-colors hover:text-neutral-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <BrandHeader
            title="Create a password"
            description={
              <>
                Logging in as <span className="font-semibold">{email}</span>
              </>
            }
          />

          <form onSubmit={handleCredentialsSubmit} className="mt-2 w-full">
            <div className="relative mb-4 w-full text-left">
              <label className="mb-1.5 block text-sm font-medium text-neutral-500">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white py-3 pr-11 pl-4 text-sm font-normal text-neutral-900 placeholder-neutral-400 shadow-xs transition-all outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer p-0.5 text-neutral-400 transition-colors hover:text-neutral-600"
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
                      className="h-4 w-4"
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
                      className="h-4 w-4"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-950 py-3.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:bg-neutral-800 active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
