/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
        "./node_modules/flowbite/**/*.js"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#1A56DB', // Blue-600
                    strong: '#1E429F',  // Blue-800
                    medium: '#3F83F8',  // Blue-500
                },
                innova: {
                    blue: '#012943',
                    orange: '#F9A62E',
                },
                neutral: {
                    primary: '#FFFFFF',
                    'secondary-soft': '#F3F4F6', // Gray-100
                    tertiary: '#E5E7EB', // Gray-200
                },
                text: {
                    heading: '#111928', // Gray-900
                    body: '#6B7280',    // Gray-500
                    'fg-brand': '#1A56DB'
                },
                border: {
                    default: '#E5E7EB'
                }
            },
            textColor: { // Mapping specific text utils if needed, but 'text-' usually maps to colors
                heading: '#111928',
                body: '#6B7280',
                'fg-brand': '#1A56DB'
            },
            borderColor: {
                default: '#E5E7EB'
            },
            borderRadius: {
                base: '0.375rem' // 6px
            }
        },
    },
    plugins: [
        require('flowbite/plugin')
    ],
}
