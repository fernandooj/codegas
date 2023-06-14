import './globals.css'
import { Inter } from 'next/font/google'
import Nav from './components/navigation/nav'
import {DataProvider} from './context/context';
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'App codegas',
  description: 'App codegas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DataProvider>
          <Nav>
            {children}
          </Nav>
        </DataProvider>
      </body>
    </html>
  )
}
