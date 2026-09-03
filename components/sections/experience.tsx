import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { roles } from "@/lib/experience";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-16 py-12 lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-center font-heading text-4xl sm:text-5xl">Experience</h2>

        <ul className="mx-auto flex max-w-4xl flex-col gap-6">
          {roles.map(role => (
            <li key={`${role.employer}-${role.title}`}>
              <Card className="ring-2 ring-foreground/20">
                <CardHeader className="flex flex-row items-center gap-4">
                  {/* Logos are dark artwork, so they get a light tile to stay legible in dark mode. */}
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-white p-2 sm:size-20">
                    <Image
                      src={role.logo.src}
                      alt={role.logo.alt}
                      width={80}
                      height={80}
                      sizes="80px"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading text-2xl leading-tight sm:text-3xl">
                      {role.employer}
                    </h3>
                    <p className="text-lg text-muted-foreground">{role.title}</p>
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
