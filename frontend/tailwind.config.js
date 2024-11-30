/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all JavaScript, TypeScript, and JSX files
  ],
  darkMode: ["class"], // Dark mode is enabled via class
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#09B928",
          DEFAULT: 'hsl(var(--primary))',
          dark: "#FFA032",
          foreground: "hsl(var(--primary-foreground))",
        },
		// primary: {
		// 	light: '#09B928',
		// 	DEFAULT: 'hsl(var(--primary))',
		// 	dark: '#FFA032',
		// 	foreground: 'hsl(var(--primary-foreground))'
		// },
        textColor: {
          light: "#FFFFFF",
          DEFAULT: "#FFFFFF",
          dark: "#95AD99",
        },
        pageBg: {
          light: "#E6E1DB",
          DEFAULT: "#E6E1DB",
          dark: "#000000",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [daisyui, require("tailwindcss-animate")],
};
