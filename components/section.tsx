import type { ReactNode } from "react";

/** The shell every content section shares: anchor, heading, and page gutter. */
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-16 py-12 lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-center font-heading text-4xl sm:text-5xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}
