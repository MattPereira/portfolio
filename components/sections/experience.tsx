import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { roles } from "@/lib/experience";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-16 py-12 lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-center font-heading text-4xl sm:text-5xl">Experience</h2>

        <ul className="mx-auto grid max-w-4xl gap-6 lg:max-w-none lg:grid-cols-3">
          {roles.map(role => (
            <li key={`${role.employer}-${role.title}`}>
              <Card className="h-full ring-2 ring-foreground/20">
                <CardHeader className="flex flex-row items-center gap-4">
                  {/* Logos are dark artwork, so they get a light tile to stay legible in dark mode. */}
                  <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-white p-3">
                    <Image
                      src={role.logo.src}
                      alt={role.logo.alt}
                      width={112}
                      height={112}
                      sizes="112px"
                      className="size-full object-contain"
                      style={{ scale: role.logo.scale }}
                    />
                  </div>
                  <div className="flex min-w-0 flex-col justify-center">
                    <h3 className="text-2xl font-bold leading-tight">{role.title}</h3>
                    <p className="text-xl text-muted-foreground">{role.employer}</p>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-base">{role.summary}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
