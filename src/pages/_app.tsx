import Providers from "@/components/providers";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from 'next/font/local'

const pixelMix = localFont({ src: "../font/Silkscreen-Regular.ttf" })
export default function App({ Component, pageProps }: AppProps) {
  return(
    <Providers>
      <main className={pixelMix.className}>
        <Component {...pageProps} />
      </main>
    </Providers>
  )
}
