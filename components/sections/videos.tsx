import Image from "next/image";
import { Section } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { getVideos } from "@/lib/videos";

export async function Videos() {
  const videos = await getVideos();

  return (
    <Section id="videos" title="Videos">
      {videos.length === 0 ? (
        // The section keeps its heading and anchor even with nothing to show, so a
        // fetch or parse failure is visible here as well as in the server logs.
        <p className="text-center text-muted-foreground">
          Videos are temporarily unavailable.
        </p>
      ) : (
        <ul className="grid auto-rows-fr gap-6 sm:grid-cols-2">
          {videos.map(video => (
            <li key={video.youtubeId}>
              <a
                href={video.url}
                target="_blank"
                rel="noreferrer"
                className="group block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Card className="h-full gap-0 overflow-hidden py-0 ring-2 ring-foreground/20 lg:flex-row">
                  {/* YouTube hqdefault thumbnails are always 480x360. */}
                  <Image
                    src={video.thumbnailUrl}
                    alt=""
                    width={480}
                    height={360}
                    sizes="(min-width: 1024px) 23vw, (min-width: 640px) 50vw, 100vw"
                    className="aspect-video w-full rounded-t-xl object-cover lg:w-[45%] lg:rounded-l-xl lg:rounded-tr-none"
                  />
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold leading-tight group-hover:text-primary">
                      {video.title}
                    </h3>
                    <p className="mt-2 text-base text-muted-foreground">{video.description}</p>
                  </CardContent>
                </Card>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
