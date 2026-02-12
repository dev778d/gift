/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Required for GitHub Pages
    images: {
        unoptimized: true, // Required for static export
    },
    // If you are deploying to a custom domain, remove the basePath logic
    // If you are deploying to username.github.io/repo-name, set basePath to /repo-name
    // basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
}

module.exports = nextConfig