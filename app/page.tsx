import { Experience } from "@/components/sections/experience";
import { Hackathons } from "@/components/sections/hackathons";
import { Landing } from "@/components/sections/landing";
import { Projects } from "@/components/sections/projects";
import { Videos } from "@/components/sections/videos";

export default function Home() {
  return (
    <>
      <Landing />
      <Experience />
      <Videos />
      <Projects />
      <Hackathons />
    </>
  );
}
