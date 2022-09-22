/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
    content: [
        "./pages/**/*.{php,js,html}"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', 'helvetica', 'sans-serif'],
            },

            colors: {
                black: colors.slate,
                success: colors.emerald,
                error: colors.rose,
                warning: colors.amber,

                brand: {
                    50: "#FFEFFC",
                    100: "#FECEF6",
                    200: "#FF8DEC",
                    300: "#F15AD7",
                    400: "#E615C3",
                    500: "#D204B0",
                    600: "#AF0092",
                    700: "#8E0076",
                    800: "#70005D",
                    900: "#64024C",
                }
            },

            container: {
                center: true,

                padding: {
                    DEFAULT: '1rem',
                    sm: '1.5rem',
                    lg: '2rem',
                    xl: '2.5rem',
                    '2xl': '4rem',
                },
            },
        },
    },
    plugins: [],
}
