import { Building2, Truck, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LegalLayout, Section, type LegalPageProps, COMPANY, ADDRESS, EMAIL } from './LegalPages';

// ─── About ──────────────────────────────────────────────────────────────────

export const AboutPage = ({ onBack }: LegalPageProps) => (
  <LegalLayout
    onBack={onBack}
    icon={Building2}
    title="About KORIX LLC"
    subtitle={`${ADDRESS} · Texas Limited Liability Company`}
  >
    <Section title="Who We Are">
      <p>
        {COMPANY} is a Texas-registered distributor of industrial and specialty goods. We select
        every product in our catalog for build quality and fitness for purpose, and we stand behind
        what we sell — from the order confirmation email to the day it arrives.
      </p>
    </Section>

    <Section title="What We Do">
      <p>
        We don't manufacture what we sell — we curate it. Our job is finding equipment and
        materials worth putting our name on, describing them accurately, and getting them to you
        without the runaround. If a product doesn't meet our bar, it doesn't go on the site.
      </p>
    </Section>

    <Section title="Registered and Accountable">
      <p>
        {COMPANY} is organized under the Texas Business Organizations Code, holds a federal EIN,
        and is registered with SAM.gov. That's a real, accountable business behind every order —
        not an anonymous storefront.
      </p>
    </Section>

    <Section title="Government & Institutional Procurement">
      <p>
        The applicable NAICS classification for our product lines is <strong>423840 — Industrial
        Supplies Merchant Wholesalers</strong>. Individual products are further classified by
        Federal Supply Class (PSC) on their product pages — for example, PPE items under{' '}
        <strong>4240 — Safety and Rescue Equipment</strong>, and material handling equipment under{' '}
        <strong>3920 — Materials Handling Equipment, Nonself-Propelled</strong>.
      </p>
      <p>
        Government, educational, non-profit, and disaster-response buyers who need a formal quote,
        purchase order, or invoicing rather than self-serve card checkout can use our{' '}
        <Link to="/request-quote" className="text-accent-700 font-medium hover:underline">
          Request a Quote / PO
        </Link>{' '}
        form.
      </p>
    </Section>

    <Section title="Questions Before You Order?">
      <p>
        Use the live chat in the bottom-right corner of any page, or email us directly at{' '}
        <strong>{EMAIL}</strong>. We respond to every message.
      </p>
    </Section>
  </LegalLayout>
);

// ─── Shipping & Returns ────────────────────────────────────────────────────

export const ShippingReturnsPage = ({ onBack }: LegalPageProps) => (
  <LegalLayout
    onBack={onBack}
    icon={Truck}
    title="Shipping & Returns"
    subtitle="Processing time, shipping time, and how returns work"
  >
    <div className="p-4 bg-navy-50 border border-navy-200 rounded-lg text-navy-800 text-sm">
      We ship to addresses anywhere within the United States. KORIX LLC itself is based in Texas.
    </div>

    <div className="p-4 bg-navy-50 border border-navy-200 rounded-lg text-navy-800 text-sm">
      We only promise shipping speeds we can actually back. If a product page doesn't list an
      expedited option, it's because we can't guarantee it yet.
    </div>

    <Section title="Where We Ship">
      <p>
        KORIX LLC sells and ships to addresses anywhere in the United States. Shipping cost is
        calculated from the weight of your order and shown at checkout before you pay — no
        surprises after the fact.
      </p>
    </Section>

    <Section title="Processing Time vs. Shipping Time">
      <p>
        <strong>Processing time</strong> is how long it takes us to prepare and hand off your order
        after you place it — typically 1–3 business days. <strong>Shipping time</strong> is how
        long the carrier takes in transit after that, which varies by destination and carrier and
        is shown at checkout before you pay. Your total delivery estimate is processing time plus
        shipping time.
      </p>
    </Section>

    <Section title="Order Tracking">
      <p>
        Once your order ships, you'll receive a confirmation email with tracking information so you
        can follow it the rest of the way. You can also check your order status any time on our{' '}
        <strong>Track Order</strong> page using your order number and the email you checked out with.
      </p>
    </Section>

    <Section title="Returns">
      <p>
        Most items may be returned for any reason within 30 days of the order's ship date, provided
        they're unused and in resalable condition in their original packaging. Contact us at{' '}
        <strong>{EMAIL}</strong> or via live chat with your order number to start a return — we'll
        confirm eligibility and next steps before you ship anything back.
      </p>
      <p>
        Some items — including custom, made-to-order, or clearly marked non-returnable products —
        are not eligible for return; this will always be noted on the product page before you buy.
      </p>
      <p>
        Return shipping is the customer's responsibility unless the item arrived damaged, defective,
        or incorrect, in which case we cover return shipping at no cost to you (see{' '}
        <strong>Damaged or Incorrect Items</strong> below).
      </p>
    </Section>

    <Section title="Refunds">
      <p>
        Once a return is received and inspected, we issue a refund to your original payment method.
        Refunds are typically processed within 5–7 business days of receipt; your bank or card
        issuer may take additional time to post the credit.
      </p>
    </Section>

    <Section title="Damaged or Incorrect Items">
      <p>
        If an item arrives damaged or isn't what you ordered, contact us within 7 days of delivery
        with photos of the item and packaging — we'll make it right at no cost to you.
      </p>
    </Section>

    <Section title="Warranty">
      <p>
        We don't manufacture what we sell, so warranty coverage — where a product carries one — comes
        directly from its manufacturer and varies by product; it isn't a blanket KORIX LLC warranty
        term. If a product page or the manufacturer's documentation states a specific warranty, that
        applies. For anything not listed, contact us at <strong>{EMAIL}</strong> with your order
        number and we'll get you the manufacturer's warranty information for that specific item.
      </p>
    </Section>
  </LegalLayout>
);

// ─── FAQ ────────────────────────────────────────────────────────────────────

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Where do you ship?',
    a: 'KORIX LLC ships to addresses anywhere within the United States. KORIX LLC itself is based in Texas.',
  },
  {
    q: 'How long will my order take to arrive?',
    a: 'Total delivery time is processing time (typically 1–3 business days) plus carrier shipping time, which is shown at checkout before you pay. See our Shipping & Returns page for details.',
  },
  {
    q: 'What if my order is too heavy for standard shipping?',
    a: "Orders totaling more than 100 lbs ship via freight rather than parcel carrier, so instead of an instant checkout price we route you to our Request a Quote / PO form so we can quote the freight cost accurately. You'll see this option automatically if your cart crosses that threshold.",
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Checkout is handled securely by Stripe, which accepts all major credit and debit cards as well as direct bank transfer (ACH), depending on what your card and bank support. We never see or store your full card or bank account number.',
  },
  {
    q: 'Can I pay by purchase order, invoice, or wire transfer instead of a card?',
    a: 'Yes. Our Request a Quote / PO form is built for government, educational, non-profit/disaster-response, and commercial buyers who need a formal quote, a purchase order, or invoicing instead of paying by card through instant checkout. Submit your organization and item details there and we’ll follow up directly.',
  },
  {
    q: 'Do you offer discounts for larger quantities?',
    a: "Select products offer automatic volume pricing — order more of an eligible item and the per-unit price drops at set quantity breaks, shown right on that product's page before you add it to your cart. Not every product has volume tiers; where one does, you'll see the pricing table there.",
  },
  {
    q: 'Do you sell to government agencies, schools, or nonprofits?',
    a: 'Yes. KORIX LLC is registered with SAM.gov, and our product line falls under NAICS 423840 — Industrial Supplies Merchant Wholesalers, with individual products further classified by Federal Supply Class (PSC) on their product pages. Government, educational, and non-profit/disaster-response buyers can use our Request a Quote / PO form for formal quotes, purchase orders, or invoicing.',
  },
  {
    q: 'Can I return an item?',
    a: "Most items can be returned for any reason within 30 days of the order's ship date if unused and in resalable condition in original packaging. Return shipping is on you unless the item arrived damaged, defective, or incorrect. A small number of items are marked non-returnable on their product page. See our Shipping & Returns page for the full policy.",
  },
  {
    q: 'Do products come with a warranty?',
    a: "Where a product carries a warranty, it's provided by the manufacturer and varies by product — not a blanket KORIX LLC warranty. Check the product page for manufacturer warranty details, or contact us with your order number and we'll find the specifics for that item.",
  },
  {
    q: 'Do you charge sales tax?',
    a: "Not at this time — KORIX LLC isn't currently registered to collect sales tax in any state, so no tax is added at checkout. If that changes, the checkout total will reflect it before you pay.",
  },
  {
    q: 'Do I need an account to order?',
    a: "No — checkout is guest-only. You'll get an email confirmation and tracking information without needing to create or manage a password.",
  },
  {
    q: 'How do I track my order?',
    a: "You'll receive a tracking link by email as soon as your order ships. You can also look up your order status any time on our Track Order page using your order number and email.",
  },
  {
    q: 'How do I find a specific product?',
    a: 'Use the search bar at the top of the Shop page to search the catalog by name, or browse by category using the tabs there.',
  },
  {
    q: 'How do I contact support?',
    a: `Use the live chat widget on any page, or email us at ${EMAIL} — we respond to every message.`,
  },
];

export const FaqPage = ({ onBack }: LegalPageProps) => (
  <LegalLayout onBack={onBack} icon={HelpCircle} title="Frequently Asked Questions" subtitle="Ordering, shipping, and returns">
    {FAQS.map((faq) => (
      <Section key={faq.q} title={faq.q}>
        <p>{faq.a}</p>
      </Section>
    ))}
  </LegalLayout>
);
