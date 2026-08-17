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
        The applicable NAICS classification for our product lines is <strong>423840 — Industrial
        Supplies Merchant Wholesalers</strong>. Individual products are further classified by
        Federal Supply Class (PSC) — for example, PPE items under{' '}
        <strong>4240 — Safety and Rescue Equipment</strong>, and shipping/packaging supplies under{' '}
        <strong>8115 — Boxes, Cartons, and Crates</strong>.
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
          <strong>Community Resource Directories</strong>
        </li>
      </ul>
      <p>
        Contact us directly for more on this line of work.
      </p>
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
        Use the live chat in the bottom-right corner of any page, or email us directly at{' '}
        <strong>{EMAIL}</strong>. We respond to every message.
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
    a: `Use the live chat widget on any page, or email us at ${EMAIL} — we respond to every message.`,
  },
];

export const FaqPage = ({ onBack }: LegalPageProps) => (
  <LegalLayout onBack={onBack} icon={HelpCircle} title="Frequently Asked Questions" subtitle="Federal contracting, RFQs, and supply capabilities">
    {FAQS.map((faq) => (
      <Section key={faq.q} title={faq.q}>
        <p>{faq.a}</p>
      </Section>
    ))}
  </LegalLayout>
);
