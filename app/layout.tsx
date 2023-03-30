import '../styles/globals.scss'
import '../styles/tiptap.scss'

export const metadata = {
  title: 'Unsteelix`s Blog',
  description: 'Photo blog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      {/* <head>
        <title>Unsteelix`s Blog</title>
      </head> */}
      <body>{children}</body>
    </html>
  )
}
