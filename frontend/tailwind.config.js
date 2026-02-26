import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            fontFamily: {
                sans: ['Nunito', 'system-ui', 'sans-serif'],
                display: ['Bebas Neue', 'system-ui', 'sans-serif'],
            },
            colors: {
                border: 'oklch(var(--border) / <alpha-value>)',
                input: 'oklch(var(--input) / <alpha-value>)',
                ring: 'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background) / <alpha-value>)',
                foreground: 'oklch(var(--foreground) / <alpha-value>)',
                primary: {
                    DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground) / <alpha-value>)'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground) / <alpha-value>)'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground) / <alpha-value>)'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground) / <alpha-value>)'
                },
                popover: {
                    DEFAULT: 'oklch(var(--popover) / <alpha-value>)',
                    foreground: 'oklch(var(--popover-foreground) / <alpha-value>)'
                },
                card: {
                    DEFAULT: 'oklch(var(--card) / <alpha-value>)',
                    foreground: 'oklch(var(--card-foreground) / <alpha-value>)'
                },
                chart: {
                    1: 'oklch(var(--chart-1))',
                    2: 'oklch(var(--chart-2))',
                    3: 'oklch(var(--chart-3))',
                    4: 'oklch(var(--chart-4))',
                    5: 'oklch(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'oklch(var(--sidebar) / <alpha-value>)',
                    foreground: 'oklch(var(--sidebar-foreground) / <alpha-value>)',
                    primary: 'oklch(var(--sidebar-primary) / <alpha-value>)',
                    'primary-foreground': 'oklch(var(--sidebar-primary-foreground) / <alpha-value>)',
                    accent: 'oklch(var(--sidebar-accent) / <alpha-value>)',
                    'accent-foreground': 'oklch(var(--sidebar-accent-foreground) / <alpha-value>)',
                    border: 'oklch(var(--sidebar-border) / <alpha-value>)',
                    ring: 'oklch(var(--sidebar-ring) / <alpha-value>)'
                },
                // Game-specific semantic tokens — use CSS variables so opacity modifiers work
                gold: 'oklch(var(--gold) / <alpha-value>)',
                'game-bg': 'oklch(var(--game-bg) / <alpha-value>)',
                'game-surface': 'oklch(var(--game-surface) / <alpha-value>)',
                'game-border': 'oklch(var(--game-border) / <alpha-value>)',
                'game-text': 'oklch(var(--game-text) / <alpha-value>)',
                'game-muted': 'oklch(var(--game-muted) / <alpha-value>)',
                player1: 'oklch(var(--player1) / <alpha-value>)',
                player2: 'oklch(var(--player2) / <alpha-value>)',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            boxShadow: {
                xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
                game: '0 4px 32px 0 rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};
