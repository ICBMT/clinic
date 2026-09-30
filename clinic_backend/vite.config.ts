import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/css/rtl.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        wayfinder({
            formVariants: true,
            // Some static PHP builds segfault at process exit AFTER generation
            // completes successfully (exit 139 with all files written). Tolerate
            // the non-zero exit here: a genuinely failed generation still breaks
            // the build because the generated @/routes and @/actions modules
            // would be missing.
            command: "sh -c 'php artisan wayfinder:generate \"$@\" || true' wayfinder",
        }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
});
