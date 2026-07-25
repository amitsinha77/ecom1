"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/data";

export function FAQSection({ items }: { items?: typeof FAQ_ITEMS }) {
  const data = items ?? FAQ_ITEMS;
  return (
    <section className="section">
      <div className="container max-w-3xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-4 text-3xl font-bold text-ink-800 md:text-4xl text-balance">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about booking with PureMaids.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          <Accordion type="single" collapsible className="space-y-3">
            {data.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
