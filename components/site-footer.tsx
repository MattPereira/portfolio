import { SocialLinks } from "@/components/social-links";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t py-3">
      <div className="mx-auto flex max-w-6xl justify-center px-4">
        <SocialLinks />
      </div>
    </footer>
  );
}
