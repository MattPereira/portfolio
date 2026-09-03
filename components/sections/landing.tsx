import Image from "next/image";
import { owner } from "@/lib/site-content";
import { SocialLinks } from "@/components/social-links";

export function Landing() {
  return (
    <section id="landing" className="scroll-mt-16 py-16 lg:py-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-8 px-4 lg:flex-row">
        <Image
          src={owner.photo}
          alt={`Portrait of ${owner.name}`}
          width={500}
          height={500}
          priority
          sizes="(min-width: 1280px) 384px, (min-width: 640px) 288px, 224px"
          className="size-56 rounded-full object-cover sm:size-72 xl:size-96"
        />

        <div className="flex flex-col items-center lg:items-start">
          <h1 className="mb-3 rounded-2xl bg-primary px-6 py-4 text-center font-heading text-4xl text-primary-foreground sm:text-5xl md:text-6xl xl:text-7xl">
            {owner.name}
          </h1>
          <h2 className="mb-4 text-center font-heading text-2xl sm:text-3xl xl:text-4xl lg:text-left">
            {owner.role}
          </h2>
          <SocialLinks
            iconClassName="size-7"
            linkClassName="size-12 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
          />
        </div>
      </div>
    </section>
  );
}
