import { Building2, Truck, HelpCircle } from 'lucide-react';
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
      We currently only ship to <strong>Texas addresses</strong>. Orders placed with a shipping
      address outside Texas are automatically refunded and cancelled — see below for details.
    </div>

    <div className="p-4 bg-navy-50 border border-navy-200 rounded-lg text-navy-800 text-sm">
      We only promise shipping speeds we can actually back. If a product page doesn't list an
      expedited option, it's because we can't guarantee it yet.
    </div>

    <Section title="Texas Addresses Only">
      <p>
        KORIX LLC currently sells and ships to Texas addresses only. Stripe Checkout will collect a
        shipping address for any U.S. state, but any order whose shipping address isn't in Texas is
        automatically refunded in full and the order is cancelled — no product ships, and no charge
        is kept. If you're ordering for delivery to another state, please hold off until we expand
        beyond Texas.
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
    q: 'Do you ship outside Texas?',
    a: "Not yet — we currently sell and ship to Texas addresses only. If you check out with a shipping address outside Texas, the order is automatically refunded and cancelled, and nothing ships.",
  },
  {
    q: 'How long will my order take to arrive?',
    a: 'Total delivery time is processing time (typically 1–3 business days) plus carrier shipping time, which is shown at checkout before you pay. See our Shipping & Returns page for details.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Checkout is handled securely by Stripe, which accepts all major credit and debit cards. We never see or store your full card number.',
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
    q: 'Do I need an account to order?',
    a: "No — checkout is guest-only. You'll get an email confirmation and tracking information without needing to create or manage a password.",
  },
  {
    q: 'How do I track my order?',
    a: "You'll receive a tracking link by email as soon as your order ships. You can also look up your order status any time on our Track Order page using your order number and email.",
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
