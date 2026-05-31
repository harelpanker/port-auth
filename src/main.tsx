import React from "react"
import { createRoot } from "react-dom/client"
import type { Root } from "react-dom/client"
import { AuthForm } from "@/components/AuthForm"
import type { Region } from "@/lib/auth0-service"
import "./index.css"

const activeRoots = new Map<HTMLElement, Root>()

interface RenderOptions {
  container: string | HTMLElement
  mode?: "signUp" | "logIn"
  defaultRegion?: Region
  initialEmail?: string
  loginUrl?: string
  signupUrl?: string
}

// Expose PortAuth globally
const PortAuth = {
  render(options: RenderOptions) {
    if (!options || !options.container) {
      console.error("PortAuth.render: 'container' option is required.")
      return
    }

    let targetElement: HTMLElement | null = null
    if (typeof options.container === "string") {
      targetElement = document.querySelector(options.container)
    } else {
      targetElement = options.container
    }

    if (!targetElement) {
      console.error(
        `PortAuth.render: Container element not found:`,
        options.container
      )
      return
    }

    // Clean up existing root at this container if already rendered
    if (activeRoots.has(targetElement)) {
      this.destroy(targetElement)
    }

    // Add CSS scope class
    if (!targetElement.classList.contains("port-auth-form-wrapper")) {
      targetElement.classList.add("port-auth-form-wrapper")
    }

    const root = createRoot(targetElement)
    activeRoots.set(targetElement, root)

    root.render(
      <AuthForm
        initialEmail={options.initialEmail || ""}
        initialMode={options.mode || "signUp"}
        loginUrl={options.loginUrl || ""}
        signupUrl={options.signupUrl || ""}
        defaultRegion={options.defaultRegion || "US"}
      />
    )
  },

  destroy(container: string | HTMLElement) {
    let targetElement: HTMLElement | null = null
    if (typeof container === "string") {
      targetElement = document.querySelector(container)
    } else {
      targetElement = container
    }

    if (!targetElement) return

    const root = activeRoots.get(targetElement)
    if (root) {
      root.unmount()
      activeRoots.delete(targetElement)
      targetElement.innerHTML = ""
    }
  },
}

// Add to window object
declare global {
  interface Window {
    PortAuth: typeof PortAuth
  }
}
window.PortAuth = PortAuth

// For local testing & development in Vite, render sandbox page
if (document.getElementById("root")) {
  const DevSandbox = () => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [path, setPath] = React.useState(window.location.pathname)

    React.useEffect(() => {
      const isLogin = path === "/login" || path.endsWith("/login")

      if (containerRef.current) {
        PortAuth.render({
          container: containerRef.current,
          mode: isLogin ? "logIn" : "signUp",
          defaultRegion: "US", // US as default for both!
          loginUrl: "/login",
          signupUrl: "/",
        })
      }

      // Sync browser history changes
      const handlePopState = () => {
        setPath(window.location.pathname)
      }
      window.addEventListener("popstate", handlePopState)

      return () => {
        window.removeEventListener("popstate", handlePopState)
        if (containerRef.current) {
          PortAuth.destroy(containerRef.current)
        }
      }
    }, [path])

    const isLogin = path === "/login" || path.endsWith("/login")

    return (
      <div className="min-h-screen bg-neutral-50 p-10 flex flex-col items-center justify-center">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Port Auth0 Embed Sandbox
          </h1>
          <p className="text-neutral-500 mt-2">
            Simulating multi-page Webflow routing.
          </p>
          <div className="mt-4 flex gap-4 justify-center">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                window.history.pushState({}, "", "/")
                setPath("/")
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                !isLogin
                  ? "bg-black text-white border-black"
                  : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              Sign Up Page (/)
            </a>
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault()
                window.history.pushState({}, "", "/login")
                setPath("/login")
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                isLogin
                  ? "bg-black text-white border-black"
                  : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              Log In Page (/login)
            </a>
          </div>
        </header>

        <div className="w-full flex flex-col items-center">
          <div className="mb-6 text-xs font-bold uppercase tracking-wider text-neutral-400 bg-white px-3 py-1 rounded-full shadow-xs border border-neutral-200">
            Current Page: {isLogin ? "/login (Log In)" : "/ (Sign Up)"}
          </div>
          <div ref={containerRef} className="w-full flex justify-center" />
        </div>
      </div>
    )
  }

  const root = createRoot(document.getElementById("root")!)
  root.render(<DevSandbox />)
}

export default PortAuth
