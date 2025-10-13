import { Toaster as Sonner } from "sonner"

interface ToasterProps {
  theme?: "light" | "dark" | "system"
  [key: string]: any
}

const Toaster = ({ theme = "system", ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      } as React.CSSProperties}
      {...props}
    />
  )
}

export { Toaster }