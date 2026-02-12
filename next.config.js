/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/gift',
    assetPrefix: '/gift',
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
}

module.exports = nextConfig