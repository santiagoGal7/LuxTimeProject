import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@/lib/content";

export const metadata: Metadata = {
  title: "Preguntas",
  description: "Preguntas frecuentes de LuxTime sobre pago simulado, grabado y stock.",
};

export default function FaqPage() {
  return (
    <div className="shell max-w-3xl">
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-forest">Mostrador</p>
      <h1 className="mt-3 font-display text-5xl md:text-6xl">Preguntas frecuentes</h1>
      <Accordion type="single" collapsible className="mt-8">
        {FAQ.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
