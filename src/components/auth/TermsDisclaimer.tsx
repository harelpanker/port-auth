export function TermsDisclaimer() {
  return (
    <p className="mx-auto mt-8 max-w-[210px] text-center text-xs text-black/60">
      By signing up to Port, you accept our{" "}
      <a
        href="https://www.port.io/legal/terms-of-service"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-neutral-600"
      >
        Terms of Service
      </a>{" "}
      and{" "}
      <a
        href="https://www.port.io/legal/privacy-policy"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-neutral-600"
      >
        Privacy Policy
      </a>
      .
    </p>
  )
}
