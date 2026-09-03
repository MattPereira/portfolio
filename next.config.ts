import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      // Scoped to /vi/**: the only YouTube host paths we build thumbnail URLs for.
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
      // Images a repo commits itself, used when its README has no hosted hero.
      // Unscoped, unlike the patterns around it: the path carries someone else's
      // owner, repo, and branch, so there is no prefix to pin.
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      // README images uploaded through GitHub: this URL is a stable redirect to a
      // presigned asset host, and the optimizer follows it without needing that
      // host allowed too — the presigned target expires after five minutes, so it
      // is never the URL we store.
      { protocol: "https", hostname: "github.com", pathname: "/user-attachments/assets/**" },
    ],
  },
};

export default nextConfig;
