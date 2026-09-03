import Image from "next/image";
import type { Thumbnail } from "@/lib/repo-readme";

interface RepoThumbnailProps {
  thumbnail: Thumbnail;
  sizes: string;
  /** Fit and padding, which differ per card; the theme swap is handled here. */
  className: string;
}

/**
 * A README hero, swapped by theme when the README ships a `<picture>` with
 * light and dark sources — GitHub renders those per color scheme, and a
 * wordmark drawn for one background disappears on the other. Both variants are
 * rendered and toggled by class rather than picked at request time, since the
 * theme is only known in the browser and these cards are server-rendered.
 */
export function RepoThumbnail({ thumbnail, sizes, className }: RepoThumbnailProps) {
  if (thumbnail.light === thumbnail.dark) {
    return <Image src={thumbnail.light} alt="" fill sizes={sizes} className={className} />;
  }

  return (
    <>
      <Image
        src={thumbnail.light}
        alt=""
        fill
        sizes={sizes}
        className={`${className} dark:hidden`}
      />
      <Image
        src={thumbnail.dark}
        alt=""
        fill
        sizes={sizes}
        className={`${className} hidden dark:block`}
      />
    </>
  );
}
