import localFont from "next/font/local";
import { Didact_Gothic } from "next/font/google";

/** Display typeface. Self-hosted: the WOFF2 lives in the repo, not on a font CDN. */
export const cubano = localFont({
  src: "../app/fonts/Cubano.woff2",
  variable: "--font-cubano",
  display: "swap",
  weight: "400",
  style: "normal",
  adjustFontFallback: "Arial",
  fallback: ["system-ui", "arial"],
});

export const didactGothic = Didact_Gothic({
  variable: "--font-didact-gothic",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
