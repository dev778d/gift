import './globals.css'

export const metadata = {
  title: '💝 Be My Valentine? 💝',
  description: 'A special Valentine message for you!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ height: '100%', margin: 0, padding: 0 }}>
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { height: 100%; overflow: hidden; background: #0f0c29; }
        `}} />
      </head>
      <body style={{ height: '100%', margin: 0, padding: 0, background: '#0f0c29' }}>
        {children}
      </body>
    </html>
  )
}
