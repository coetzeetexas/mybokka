import { Landmark, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LegalLayout, Section, type LegalPageProps, COMPANY, ADDRESS, EMAIL } from './LegalPages';

// ─── About ──────────────────────────────────────────────────────────────────

export const AboutPage = ({ onBack }: LegalPageProps) => (
  <LegalLayout
    onBack={onBack}
    icon={Landmark}
    title="About KORIX LLC"
    subtitle={`${ADDRESS} · Texas Limited Liability Company`}
  >
    <Section title="Who We Are">
      <p>
        {COMPANY} is a Texas-registered small business providing consumable supply solutions to
        federal government agencies, and digital services including community resource
        directories. We don't manufacture what we sell — we source and vet it, and stand behind
        every item on our supply list.
      </p>
    </Section>

    <Section title="Government & Institutional Procurement">
      <p>
        Our product lines are classified under <strong>NAICS 423840 — Industrial Supplies
        Merchant Wholesalers</strong>, with individual items further classified by Federal Supply
        Class (PSC) as applicable to each solicitation.
      </p>
      <p>
        Government, educational, non-profit, and commercial buyers who need a formal quote,
        purchase order, or invoicing can use our{' '}
        <Link to="/request-quote" className="text-accent-700 font-medium hover:underline">
          Request a Quote / PO
        </Link>{' '}
        form.
      </p>
    </Section>

    <Section title="Digital Services">
      <p>
        Alongside federal supply, {COMPANY} provides practical technical and creative support
        across:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>PCB Design &amp; Engineering:</strong> schematic capture, PCB layout, design
          reviews, prototyping support, and manufacturing-ready documentation.
        </li>
        <li>
          <strong>Graphic Design:</strong> professional visual materials for products, operations,
          marketing, and training.
        </li>
        <li>
          <strong>Web Design:</strong> clear, responsive websites and digital tools built to
          support business operations and customer engagement.
        </li>
        <li>
          <strong>Community Resource Directories:</strong> searchable directories connecting
          people to local services — live today at{' '}
          <a
            href="https://korixusa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-700 font-medium hover:underline"
          >
            korixusa.com
          </a>{' '}
          (business listings) and{' '}
          <a
            href="https://dallas.korixusa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-700 font-medium hover:underline"
          >
            dallas.korixusa.com
          </a>{' '}
          (medical resource listings). We're building AI-powered natural-language search as the
          next step for this line of work.
        </li>
      </ul>
      <p>
        Contact us directly for more on this line of work.
      </p>
    </Section>

    <Section title="PCB Reverse Engineering">
      <p>
        For legacy or custom electronics with no existing design files, {COMPANY} reconstructs
        the design from the physical hardware — producing manufacturing-ready schematics and PCB
        layouts your team can build on.
      </p>
      <picture>
        <source srcSet="/pcb-reverse-engineering-infographic.webp" type="image/webp" />
        <img
          src="/pcb-reverse-engineering-infographic.png"
          alt="PCB reverse engineering workflow: Phase 1, Hardware Analysis, examines existing boards to extract design data; Phase 2, Design Deliverables, recreates complete schematics and new PCB layouts ready for manufacturing."
          className="w-full h-auto rounded-xl border border-gray-200 shadow-sm"
          width={1600}
          height={893}
          loading="lazy"
        />
      </picture>
    </Section>

    <Section title="Registered and Accountable">
      <p>
        {COMPANY} is organized under the Texas Business Organizations Code, holds a federal EIN,
        and has submitted its SAM.gov registration (UEI FERJZSV2LC45) — active status is pending.
        That's a real, accountable business behind every quote request — not an anonymous
        storefront.
      </p>
    </Section>

    <Section title="Questions About a Solicitation or Quote?">
      <p>
        Email us directly at <strong>{EMAIL}</strong>. We respond to every message.
      </p>
    </Section>
  </LegalLayout>
);

// ─── FAQ ────────────────────────────────────────────────────────────────────

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Where do you ship?',
    a: 'KORIX LLC ships to addresses anywhere within the United States. KORIX LLC itself is based in Dallas, Texas.',
  },
  {
    q: 'What is KORIX LLC’s UEI and EIN?',
    a: 'UEI: FERJZSV2LC45. EIN: 42-2983677. Both are listed in the footer of every page.',
  },
  {
    q: 'Is KORIX LLC registered in SAM.gov?',
    a: 'Registration has been submitted; active status is pending. We’ll update this once SAM.gov confirms active status.',
  },
  {
    q: 'What supply categories does KORIX LLC offer?',
    a: 'We source and fulfill consumable supplies for federal, institutional, and commercial buyers, classified by NAICS 423840 and by Federal Supply Class (PSC) as applicable. Contact us or use the Request a Quote / PO form with what you need and we’ll confirm availability.',
  },
  {
    q: 'What digital services does KORIX LLC offer?',
    a: 'PCB design and engineering services, graphic design, web design, and community resource directories. Contact us directly for more on this line of work.',
  },
  {
    q: 'How do I request a quote or submit a purchase order?',
    a: 'Use the Request a Quote / PO form — tell us your organization, buyer type, delivery location, and the items you need. A person reviews every submission and follows up directly with a formal quote, purchase order, or invoice.',
  },
  {
    q: 'Can I pay by purchase order, invoice, or wire transfer?',
    a: 'Yes — this is our primary process for government, educational, non-profit, and commercial buyers. Submit your organization and item details through the Request a Quote / PO form and we’ll follow up directly.',
  },
  {
    q: 'Does KORIX LLC accept net-terms/invoicing for government and institutional buyers?',
    a: 'Yes. Net-terms and invoicing arrangements are discussed individually per quote — include your preference in the Items Needed field of the Request a Quote / PO form and we’ll address it in our follow-up.',
  },
  {
    q: 'Do you offer discounts for larger quantities?',
    a: 'Yes, on many items — volume pricing is quoted individually. Include the quantity you need in the Request a Quote / PO form and we’ll price it accordingly.',
  },
  {
    q: 'Do you sell to government agencies, schools, or nonprofits?',
    a: 'Yes. KORIX LLC has submitted its SAM.gov registration (active status pending), and our product line falls under NAICS 423840 — Industrial Supplies Merchant Wholesalers, with individual products further classified by Federal Supply Class (PSC). Government, educational, and non-profit buyers can use our Request a Quote / PO form for formal quotes, purchase orders, or invoicing.',
  },
  {
    q: 'How do I contact support?',
    a: `Email us at ${EMAIL} — we respond to every message.`,
  },
];

// Generated from the same FAQS array the page renders, so structured data
// can never drift out of sync with what's actually visible — and it only
// exists in the DOM while /faq is mounted, matching Google's requirement
// that FAQPage rich-result data reflect the page's own visible content.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
};

export const FaqPage = ({ onBack }: LegalPageProps) => (
  <LegalLayout onBack={onBack} icon={HelpCircle} title="Frequently Asked Questions" subtitle="Federal contracting, RFQs, and supply capabilities">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    {FAQS.map((faq) => (
      <Section key={faq.q} title={faq.q}>
        <p>{faq.a}</p>
      </Section>
    ))}
  </LegalLayout>
);
