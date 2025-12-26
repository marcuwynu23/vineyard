import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gitlab: {
          dark: '#171321', // Dark sidebar/header
          purple: '#7b58cf', // GitLab accent
          blue: {
            500: '#1f75cb', // Primary Link/Button
            600: '#1068bf',
            700: '#0c5299',
          },
          gray: {
            50: '#f9f9f9', // Background
            100: '#ececef',
            200: '#dcdcde', // Borders
            500: '#737278', // Secondary text
            700: '#303030', // Primary text
            900: '#171321', // Sidebar text/bg
          },
          status: {
            success: '#108548',
            warning: '#b55e05',
            danger: '#dd2b0e',
            neutral: '#525252'
          }
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;
