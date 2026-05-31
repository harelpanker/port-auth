
export function TermsDisclaimer() {
  return (
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
  )
}
