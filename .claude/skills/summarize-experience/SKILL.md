---
name: summarize-experience
description: Rewrite the Experience section's role summaries from the resume.
disable-model-invocation: true
---

Reseed `lib/experience.ts` from the resume: the three most recent roles, each as one paragraph.

## Fetch the resume

`resumeUrl` in `lib/site-content.ts` is a Google Doc `/edit` link. Swap the trailing `/edit?...` for `/export?format=txt` and `curl -sL` it — the `/edit` URL returns the editor's HTML shell, not the document.

Completion: the plain-text EXPERIENCE section is on disk.

## Pick the roles

Take the three most recent by start date. The resume lists them newest first, so they are the first three under EXPERIENCE. Older roles are dropped from the file entirely, not commented out.

Completion: exactly three employers named.

## Write the summaries

One paragraph per role, replacing that role's bullets. Each paragraph:

- Runs to 100 words or fewer, and lands within 10 words of the other two — a visitor scanning three cards should see three blocks of the same weight.
- Carries every bullet's substance. Where a role's bullets are too thin to fill a paragraph of matching weight, draw on the owner's own published copy about that role — the prior site's Experience text in git history, or the linked repos. Invent nothing.
- Names the concrete work — the products, protocols, and tools — in prose. Third person is implied throughout the file, so the subject is dropped: "Built X and shipped Y", not "I built X".

Count the words of each paragraph and print the three counts. A paragraph outside the bounds gets rewritten before you move on.

Completion: three counts printed, each ≤100, spread ≤10.

## Update the file

Keep the module's existing shape: one entry per role in `roles`, each carrying `employer`, `title`, `logo`, and the paragraph. Match whatever the current field names are rather than introducing new ones.

Completion: `pnpm typecheck`, `pnpm lint`, and `pnpm build` all pass, and the rendered section shows three cards.
