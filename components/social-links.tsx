import { socials } from "@/lib/site-content";
import { socialIcons } from "@/components/social-icons";
import { cn } from "@/lib/utils";

export function SocialLinks({
  iconClassName,
  linkClassName,
}: {
  iconClassName?: string;
  linkClassName?: string;
}) {
  return (
    <ul className="flex items-center gap-3">
      {socials.map(({ id, label, href }) => {
        const Icon = socialIcons[id];
        return (
          <li key={id}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className={cn(
                "inline-flex items-center justify-center rounded-full transition-colors hover:text-primary",
                linkClassName,
              )}
            >
              <Icon className={cn("size-7", iconClassName)} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
