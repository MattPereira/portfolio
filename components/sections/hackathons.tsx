import Image from "next/image";
import { Section } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { getHackathons } from "@/lib/hackathons";

export async function Hackathons() {
  const hackathons = await getHackathons();

  return (
    <Section id="hackathons" title="Hackathons">
      {hackathons.length === 0 ? (
        // The section keeps its heading and anchor even with nothing to show, so a
        // fetch or parse failure is visible here as well as in the server logs.
        <p className="text-center text-muted-foreground">Hackathons are temporarily unavailable.</p>
      ) : (
        <ul className="grid auto-rows-fr gap-6 sm:grid-cols-2">
          {hackathons.map(hackathon => (
            <li key={`${hackathon.title}-${hackathon.date}`}>
              <Card className="h-full gap-0 overflow-hidden py-0 ring-2 ring-foreground/20 lg:flex-row">
                {hackathon.thumbnailUrl !== null && (
                  // Repo READMEs give no dimensions, so the image fills a fixed
                  // aspect box rather than driving the layout itself. An SVG is a
                  // wordmark or logo often enough that cropping one looks broken,
                  // so those are fitted whole instead.
                  <div className="relative aspect-video w-full shrink-0 bg-muted lg:aspect-auto lg:w-[45%]">
                    <Image
                      src={hackathon.thumbnailUrl}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 23vw, (min-width: 640px) 50vw, 100vw"
                      className={
                        hackathon.thumbnailUrl.endsWith(".svg")
                          ? "object-contain p-6"
                          : "object-cover"
                      }
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold leading-tight">{hackathon.title}</h3>
                  <p className="text-base text-muted-foreground">{hackathon.date}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {hackathon.links.map(link => (
                      <li key={link.url}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex rounded-lg px-3 py-1.5 text-base font-bold ring-2 ring-foreground/20 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
