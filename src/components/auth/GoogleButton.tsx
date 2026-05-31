
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

interface GoogleButtonProps {
  onClick: () => void
}

export function GoogleButton({ onClick }: GoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-3 border border-neutral-200 bg-white hover:bg-neutral-50 active:translate-y-px transition-all rounded-xl text-neutral-700 font-medium text-sm cursor-pointer shadow-xs flex items-center justify-center gap-2.5"
    >
      <GoogleLogo />
      <span>Continue with Google</span>
    </button>
  )
}
