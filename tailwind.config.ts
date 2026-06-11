import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        mint: {
          300: '#6FF6DF',
          400: '#2EE8C4',
          500: '#15C9A8',
        },
      },
      fontFamily: {
        pretendard: ['Pretendard Variable', 'Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
