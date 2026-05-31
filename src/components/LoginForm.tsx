import React, { useState } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import type { Region } from "@/lib/auth0-service"
import {
  loginWithGoogle,
  loginWithRedirect,
  sendPasswordResetEmail,
} from "@/lib/auth0-service"
import { RegionToggle } from "./auth/RegionToggle"
import { BrandHeader } from "./auth/BrandHeader"
import { GoogleButton } from "./auth/GoogleButton"
import { Button } from "./ui/button"

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
  const [email, setEmail] = useState(initialEmail)
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
      loginWithRedirect(region, email)
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
    <div className="relative flex w-full flex-col px-9 py-10">
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

      {/* Email Form */}
      {!isForgotPassword && (
        <div className="flex w-full animate-in flex-col duration-200 fade-in">
          <BrandHeader title="Log in to Port" />

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

          <div className="my-4 flex w-full items-center justify-between text-sm text-black/60">
            {signupUrl && (
              <span>
                New to Port?{" "}
                <button
                  type="button"
                  onClick={handleSignupClick}
                  className="cursor-pointer font-semibold text-black hover:underline"
                >
                  Sign up
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(true)
                setError(null)
                setSuccessMessage(null)
              }}
              className="ml-auto cursor-pointer font-semibold text-black hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Divider */}
          <div className="mb-6 flex w-full items-center">
            <div className="flex-1 border-t border-[#E3E3E3]" />
            <span className="px-4 text-sm text-black/60">OR</span>
            <div className="flex-1 border-t border-[#E3E3E3]" />
          </div>

          {/* Google Login */}
          <GoogleButton onClick={handleGoogleLogin} />
        </div>
      )}

      {/* Forgot Password View */}
      {isForgotPassword && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
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
              disabled={isLoading}
              className="h-auto rounded-xl py-3.5 font-medium transition"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending email...</span>
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
