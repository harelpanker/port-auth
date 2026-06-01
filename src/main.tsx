import React from "react"
import { createRoot } from "react-dom/client"
import type { Root } from "react-dom/client"
import { SignUpForm } from "@/components/SignUpForm"
import { LoginForm } from "@/components/LoginForm"
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
  state?: Record<string, string>
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

    const isLogin = options.mode === "logIn"

    root.render(
      isLogin ? (
        <LoginForm
          initialEmail={options.initialEmail || ""}
          signupUrl={options.signupUrl || ""}
          defaultRegion={options.defaultRegion || "US"}
          state={options.state}
        />
      ) : (
        <SignUpForm
          initialEmail={options.initialEmail || ""}
          loginUrl={options.loginUrl || ""}
          defaultRegion={options.defaultRegion || "US"}
          state={options.state}
        />
      )
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
          defaultRegion: "US", // US as default
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

    return (
      <div className="wrapper mx-auto flex min-h-screen w-full max-w-sm flex-col overflow-clip bg-white font-sans antialiased">
        <div ref={containerRef} />
      </div>
    )
  }

  const root = createRoot(document.getElementById("root")!)
  root.render(<DevSandbox />)
}

export default PortAuth
