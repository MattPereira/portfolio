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
        <ul className="mx-auto grid max-w-4xl gap-6">
          {hackathons.map(hackathon => (
            <li key={`${hackathon.title}-${hackathon.date}`}>
              <Card className="ring-2 ring-foreground/20">
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold leading-tight">{hackathon.title}</h3>
                    <p className="text-base text-muted-foreground">{hackathon.date}</p>
                  </div>
                  <ul className="flex flex-wrap gap-2">
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
