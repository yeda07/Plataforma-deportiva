import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          50: "hsl(var(--primary-50))",
          100: "hsl(var(--primary-100))",
          200: "hsl(var(--primary-200))",
          300: "hsl(var(--primary-300))",
          400: "hsl(var(--primary-400))",
          500: "hsl(var(--primary-500))",
          600: "hsl(var(--primary-600))",
          700: "hsl(var(--primary-700))",
          800: "hsl(var(--primary-800))",
          900: "hsl(var(--primary-900))",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
          soft: "hsl(var(--primary-soft))"
        },
        surface: "hsl(var(--surface))",
        "surface-foreground": "hsl(var(--surface-foreground))",
        "surface-subtle": "hsl(var(--surface-subtle))",
        "surface-elevated": "hsl(var(--surface-elevated))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        "card-hover": "hsl(var(--card-hover))",
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
        "border-strong": "hsl(var(--border-strong))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))"
      },
      backgroundImage: {
        "gradient-brand": "var(--gradient-brand)",
        "gradient-hero": "var(--gradient-hero)",
        "gradient-button": "var(--gradient-button)",
        "gradient-level": "var(--gradient-level)",
        "gradient-live": "var(--gradient-live)"
      },
      fontSize: {
        display: ["3.75rem", { lineHeight: "0.95", fontWeight: "850" }],
        h1: ["2.5rem", { lineHeight: "1.05", fontWeight: "820" }],
        h2: ["1.875rem", { lineHeight: "1.12", fontWeight: "780" }],
        h3: ["1.25rem", { lineHeight: "1.25", fontWeight: "700" }],
        title: ["1rem", { lineHeight: "1.25", fontWeight: "720" }],
        body: ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        "body-small": ["0.9375rem", { lineHeight: "1.45", fontWeight: "400" }],
        caption: ["0.8125rem", { lineHeight: "1.4", fontWeight: "400" }],
        label: ["0.875rem", { lineHeight: "1.25", fontWeight: "650" }],
        score: ["2rem", { lineHeight: "1", fontWeight: "850" }]
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
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)"
      },
      boxShadow: {
        xs: "0 1px 1px hsl(var(--shadow) / 0.08)",
        sm: "0 2px 8px hsl(var(--shadow) / 0.10)",
        card: "0 10px 28px hsl(var(--shadow) / 0.10), 0 1px 0 hsl(0 0% 100% / 0.55) inset",
        "card-hover": "0 16px 38px hsl(var(--shadow) / 0.16), 0 0 0 1px hsl(var(--primary) / 0.18)",
        floating: "0 20px 55px hsl(var(--shadow) / 0.18)",
        hero: "0 28px 80px hsl(var(--shadow) / 0.22)",
        md: "0 10px 24px hsl(var(--shadow) / 0.18)",
        lg: "0 20px 48px hsl(var(--shadow) / 0.24)"
      }
    }
  },
  plugins: []
};

export default config;
