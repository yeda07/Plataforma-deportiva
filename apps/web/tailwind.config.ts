import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        "surface-foreground": "hsl(var(--surface-foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        "primary-hover": "hsl(var(--primary-hover))",
        "primary-light": "hsl(var(--primary-light))",
        "primary-dark": "hsl(var(--primary-dark))",
        "primary-soft": "hsl(var(--primary-soft))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        "surface-secondary": "hsl(var(--surface-secondary))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        "accent-purple": "hsl(var(--accent-purple))",
        gold: "hsl(var(--gold))",
        "gold-foreground": "hsl(var(--gold-foreground))",
        info: "hsl(var(--info))",
        "info-foreground": "hsl(var(--info-foreground))",
        elevated: "hsl(var(--elevated))",
        "elevated-foreground": "hsl(var(--elevated-foreground))",
        live: "hsl(var(--live))",
        "live-foreground": "hsl(var(--live-foreground))",
        success: "hsl(var(--success))",
        "success-foreground": "hsl(var(--success-foreground))",
        warning: "hsl(var(--warning))",
        "warning-foreground": "hsl(var(--warning-foreground))",
        error: "hsl(var(--error))",
        "error-foreground": "hsl(var(--error-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        "text-secondary": "hsl(var(--text-secondary))",
        "text-muted": "hsl(var(--text-muted))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))"
      },
      fontSize: {
        display: ["3rem", { lineHeight: "1", fontWeight: "800" }],
        h1: ["2.25rem", { lineHeight: "1.1", fontWeight: "800" }],
        h2: ["1.875rem", { lineHeight: "1.15", fontWeight: "750" }],
        h3: ["1.25rem", { lineHeight: "1.25", fontWeight: "700" }],
        body: ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["0.8125rem", { lineHeight: "1.4", fontWeight: "400" }],
        label: ["0.875rem", { lineHeight: "1.25", fontWeight: "650" }]
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        12: "48px"
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px"
      },
      boxShadow: {
        sm: "0 1px 2px hsl(var(--shadow) / 0.18)",
        md: "0 10px 24px hsl(var(--shadow) / 0.22)",
        lg: "0 20px 48px hsl(var(--shadow) / 0.28)"
      }
    }
  },
  plugins: []
};

export default config;
