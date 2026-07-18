import { ArrowLeft, Shield, FileText, Cookie } from 'lucide-react';

export const EFFECTIVE_DATE = 'July 17, 2026';
export const COMPANY = 'KORIX LLC';
export const STATE = 'Texas';
export const EMAIL = 'korixllc@outlook.com';
export const ADDRESS = 'Fort Worth, Dallas, Texas, USA';

export interface LegalPageProps {
  onBack: () => void;
}

export const LegalLayout = ({
  onBack,
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  onBack: () => void;
  icon: typeof Shield;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <div className="min-h-screen bg-white font-sans antialiased">
    {/* Header */}
    <div className="bg-navy-900 text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to KORIX LLC
        </button>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-accent-700/20 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-accent-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">{title}</h1>
        </div>
        <p className="text-white/60">{subtitle}</p>
      </div>
    </div>

    {/* Content */}
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="space-y-8">
        {children}
      </div>
      <div className="mt-16 pt-8 border-t border-gray-200 text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white font-semibold rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Return to KORIX LLC
        </button>
      </div>
    </div>
  </div>
);

export const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h2 className="text-xl font-bold text-navy-900 mb-3 pb-2 border-b border-gray-100">{title}</h2>
    <div className="text-gray-700 leading-relaxed space-y-3">{children}</div>
  </section>
);

// ─── Terms & Conditions ───────────────────────────────────────────────────────

export const TermsPage = ({ onBack }: LegalPageProps) => (
  <LegalLayout
    onBack={onBack}
    icon={FileText}
    title="Terms & Conditions"
    subtitle={`Effective Date: ${EFFECTIVE_DATE} · Governing Law: State of ${STATE}`}
  >
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
      Please read these Terms and Conditions carefully before using the services offered by {COMPANY}. By accessing our website or engaging our services, you agree to be bound by these terms.
    </div>

    <Section title="1. Parties and Agreement">
      <p>
        These Terms and Conditions ("Agreement") constitute a legally binding contract between {COMPANY}, a Texas limited liability company ("Company," "we," "us," or "our"), and you ("Customer," "you," or "your"). This Agreement governs your use of our website at korixllc.com and all purchases of products made through it.
      </p>
      <p>
        {COMPANY} is organized and in good standing under the Texas Business Organizations Code, Chapter 101 (Texas Limited Liability Company Act).
      </p>
    </Section>

    <Section title="2. Products and Orders">
      <p>
        {COMPANY} sells industrial and specialty goods through korixllc.com. Product descriptions, specifications, and images are provided to help you make an informed purchase; we make reasonable efforts to keep this information accurate but do not warrant that it is error-free, complete, or current at all times. Placing an order constitutes an offer to purchase, which {COMPANY} may accept or decline (for example, in cases of pricing errors, suspected fraud, or stock unavailability). Order confirmation is sent by email once payment is processed.
      </p>
    </Section>

    <Section title="3. Payment and Pricing">
      <p>
        All prices are stated in United States Dollars (USD) and are due in full at checkout. Payments are processed by Stripe, a third-party payment processor; {COMPANY} does not receive or store your full card number. Applicable sales tax and shipping costs are calculated and disclosed before you complete checkout.
      </p>
    </Section>

    <Section title="4. Shipping and Processing Time">
      <p>
        Order processing time (the time between order placement and shipment) is separate from carrier shipping time (the time in transit after a package is handed to the carrier). Estimated timeframes for both are posted on our <strong>Shipping &amp; Returns</strong> page. {COMPANY} will not represent a delivery speed it cannot reasonably meet, and delays caused by carriers or events outside our control are not guaranteed against.
      </p>
    </Section>

    <Section title="5. Returns and Refunds">
      <p>
        Our return window, eligibility conditions, and refund process are set out in full on our <strong>Shipping &amp; Returns</strong> page, which is incorporated into these Terms by reference. Refunds are issued to the original payment method once a return is received and inspected.
      </p>
    </Section>

    <Section title="6. Product Use and Safety Disclaimer">
      <p>
        Many products sold by {COMPANY} are intended for industrial, commercial, or specialized use and may require proper training, protective equipment, or professional installation. It is the Customer's responsibility to review any included documentation, safety data, or manufacturer specifications and to use products only as intended and in compliance with applicable safety codes and regulations. {COMPANY} is not responsible for injury, loss, or damage resulting from misuse, improper installation, or use of a product outside its intended application.
      </p>
    </Section>

    <Section title="7. Intellectual Property">
      <p>
        All website content — including text, graphics, logos, and product photography created or licensed by {COMPANY} — remains the property of {COMPANY} or its licensors and may not be reproduced without permission.
      </p>
    </Section>

    <Section title="8. Limitation of Liability">
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY TEXAS LAW, {COMPANY.toUpperCase()}'S TOTAL LIABILITY ARISING OUT OF OR RELATING TO ANY ORDER SHALL NOT EXCEED THE AMOUNT PAID FOR THE PRODUCT(S) GIVING RISE TO THE CLAIM. IN NO EVENT SHALL {COMPANY.toUpperCase()} BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS OR REVENUE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
      </p>
    </Section>

    <Section title="9. Disclaimer of Warranties">
      <p>
        EXCEPT AS EXPRESSLY STATED ON A PRODUCT PAGE OR MANUFACTURER DOCUMENTATION, PRODUCTS ARE SOLD "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE, TO THE EXTENT PERMITTED BY TEXAS LAW. NOTHING IN THIS SECTION LIMITS ANY WARRANTY RIGHTS YOU MAY HAVE DIRECTLY AGAINST A PRODUCT'S MANUFACTURER.
      </p>
      <p>
        {COMPANY} does not itself manufacture the products it sells. Where a warranty applies to a
        product, it is provided by that product's manufacturer, and its length and terms vary by
        product — {COMPANY} does not offer a separate, blanket store-wide warranty. Contact us with
        your order number and we will help you locate the manufacturer's warranty information for
        the specific product you purchased.
      </p>
    </Section>

    <Section title="10. Governing Law and Dispute Resolution">
      <p>
        This Agreement shall be governed exclusively by the laws of the State of Texas, without regard to its conflict-of-laws principles. Any dispute arising under or related to this Agreement shall first be submitted to non-binding mediation in Dallas County, Texas. If mediation is unsuccessful, disputes shall be resolved by binding arbitration under the American Arbitration Association Commercial Arbitration Rules, seated in Dallas, Texas. Notwithstanding the foregoing, either party may seek injunctive or equitable relief in any court of competent jurisdiction in Dallas County, Texas.
      </p>
    </Section>

    <Section title="11. Force Majeure">
      <p>
        Neither party shall be liable for delays or failures in performance resulting from causes beyond its reasonable control, including natural disasters, acts of government, carrier delays, power failures, internet disruptions, or other events of force majeure, provided the affected party gives prompt notice where practicable.
      </p>
    </Section>

    <Section title="12. Entire Agreement and Amendments">
      <p>
        This Agreement constitutes the entire agreement between the parties regarding use of the website and purchase of products, and supersedes all prior negotiations, representations, or agreements. {COMPANY} reserves the right to modify these Terms at any time. Material changes will be communicated via prominent website notice at least fourteen (14) days prior to taking effect. Continued use of the website after the effective date constitutes acceptance.
      </p>
    </Section>

    <Section title="13. Contact Information">
      <p>
        Questions regarding these Terms may be directed to:<br />
        <strong>{COMPANY}</strong><br />
        {ADDRESS}<br />
        Email: {EMAIL}
      </p>
    </Section>
  </LegalLayout>
);

// ─── Privacy Policy ───────────────────────────────────────────────────────────

export const PrivacyPage = ({ onBack }: LegalPageProps) => (
  <LegalLayout
    onBack={onBack}
    icon={Shield}
    title="Privacy Policy"
    subtitle={`Effective Date: ${EFFECTIVE_DATE} · Compliant with Texas Data Privacy and Security Act (TDPSA)`}
  >
    <div className="p-4 bg-navy-50 border border-navy-200 rounded-lg text-navy-800 text-sm">
      This Privacy Policy describes how {COMPANY} collects, uses, discloses, and protects personal data in compliance with the Texas Data Privacy and Security Act (TDPSA), Tex. Bus. & Com. Code Ch. 541, effective July 1, 2024, and other applicable Texas laws.
    </div>

    <Section title="1. Identity of the Controller">
      <p>
        {COMPANY}, a Texas limited liability company located in {ADDRESS}, is the data controller responsible for personal data collected through our website and service engagements. Contact: {EMAIL}.
      </p>
    </Section>

    <Section title="2. Personal Data We Collect">
      <p>We collect the following categories of personal data:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Order Data:</strong> Name, email address, shipping address, billing address, and order contents when you place an order.</li>
        <li><strong>Payment Data:</strong> Payment is handled entirely by Stripe; {COMPANY} never receives or stores your full card number. We retain only a Stripe-issued transaction reference.</li>
        <li><strong>Communication Data:</strong> Messages submitted via our live chat or email correspondence.</li>
        <li><strong>Usage Data:</strong> IP address, browser type and version, pages visited, time spent, referring URLs, and other diagnostic data collected automatically when you visit our website.</li>
        <li><strong>Technical Data:</strong> Device identifiers, operating system, and browser settings.</li>
      </ul>
      <p>We do not knowingly collect sensitive personal data as defined by TDPSA § 541.002(18) (including racial or ethnic origin, religious beliefs, health data, biometric data, precise geolocation, or data concerning minors) without explicit consent.</p>
    </Section>

    <Section title="3. How We Collect Personal Data">
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Directly from you:</strong> When you place an order, use our live chat, or correspond with us by email.</li>
        <li><strong>Automatically:</strong> Through cookies and similar technologies when you browse our website (see our Cookie Policy).</li>
        <li><strong>From payment processing:</strong> Stripe provides us confirmation and limited billing details necessary to fulfill your order.</li>
      </ul>
    </Section>

    <Section title="4. Purposes and Legal Basis for Processing">
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Order Fulfillment:</strong> To process payment, ship your order, and send order/shipping confirmations.</li>
        <li><strong>Customer Support:</strong> To respond to questions about an order via email or live chat.</li>
        <li><strong>Marketing (with consent):</strong> To send order-related or promotional emails. You may opt out at any time.</li>
        <li><strong>Website Analytics:</strong> To understand how visitors interact with our site and improve user experience.</li>
        <li><strong>Legal Compliance:</strong> To comply with applicable Texas and federal laws and regulations, including tax recordkeeping.</li>
        <li><strong>Security:</strong> To detect, prevent, and address fraud, unauthorized activity, and technical issues.</li>
      </ul>
    </Section>

    <Section title="5. Your Rights Under the Texas Data Privacy and Security Act (TDPSA)">
      <p>Texas residents have the following rights with respect to their personal data, subject to certain exceptions under Tex. Bus. & Com. Code § 541.051:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Right to Access:</strong> Confirm whether we process your personal data and obtain a copy.</li>
        <li><strong>Right to Correction:</strong> Request correction of inaccurate personal data.</li>
        <li><strong>Right to Deletion:</strong> Request deletion of personal data we hold about you.</li>
        <li><strong>Right to Data Portability:</strong> Receive your personal data in a portable, readily usable format.</li>
        <li><strong>Right to Opt Out:</strong> Opt out of (a) the sale of personal data; (b) targeted advertising; and (c) profiling in furtherance of solely automated decisions that produce legal or similarly significant effects.</li>
        <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any of these rights.</li>
      </ul>
      <p>
        To exercise any of these rights, submit a verifiable request to <strong>{EMAIL}</strong>. We will respond within forty-five (45) days of receipt, with a possible extension of an additional forty-five (45) days where reasonably necessary, as permitted by TDPSA § 541.053. If we decline your request, you may appeal by contacting us. If your appeal is denied, you may contact the Texas Attorney General at <strong>texasattorneygeneral.gov</strong>.
      </p>
    </Section>

    <Section title="6. Disclosure of Personal Data">
      <p>We do not sell your personal data. We may share personal data with:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Stripe:</strong> Our payment processor, to complete and secure your transaction.</li>
        <li><strong>Supabase:</strong> Our database provider, which stores order and product data on our behalf.</li>
        <li><strong>Shipping Carriers:</strong> Name and shipping address, solely to deliver your order.</li>
        <li><strong>Professional Advisors:</strong> Attorneys, accountants, or insurers under confidentiality obligations.</li>
        <li><strong>Legal Authorities:</strong> When required by Texas or federal law, court order, or to protect the rights, property, or safety of {COMPANY} or others.</li>
        <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or asset sale, subject to continued compliance with this Policy.</li>
      </ul>
    </Section>

    <Section title="7. Data Retention">
      <p>
        We retain personal data only as long as necessary to fulfill the purposes described in this Policy, plus any additional period required by Texas law or legitimate business need. Order and transaction records are retained for seven (7) years in accordance with standard Texas business and tax recordkeeping practices. You may request earlier deletion of non-order data subject to our legal obligations.
      </p>
    </Section>

    <Section title="8. Security">
      <p>
        We implement commercially reasonable technical and organizational measures to protect personal data against unauthorized access, alteration, disclosure, or destruction, including encryption in transit, access controls, and regular security assessments. No method of transmission over the internet is 100% secure; we cannot guarantee absolute security.
      </p>
    </Section>

    <Section title="9. Children's Privacy">
      <p>
        Our services are directed to businesses and professionals. We do not knowingly collect personal data from individuals under the age of 13. If we discover that we have inadvertently collected such data, we will delete it promptly in accordance with the Children's Online Privacy Protection Act (COPPA) and TDPSA provisions applicable to minors.
      </p>
    </Section>

    <Section title="10. Third-Party Links">
      <p>
        Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review their privacy policies before providing personal data.
      </p>
    </Section>

    <Section title="11. Changes to This Policy">
      <p>
        We may update this Privacy Policy periodically to reflect changes in our practices or applicable law. We will post the revised policy on our website with an updated effective date and, for material changes, provide notice by email or prominent website banner at least fourteen (14) days before the change takes effect.
      </p>
    </Section>

    <Section title="12. Contact and Complaints">
      <p>
        For privacy-related inquiries, to exercise your rights, or to lodge a complaint, contact:<br />
        <strong>{COMPANY} – Privacy Officer</strong><br />
        {ADDRESS}<br />
        Email: {EMAIL}
      </p>
      <p>
        If you believe your rights under the TDPSA have been violated, you may also file a complaint with the <strong>Texas Attorney General's Office</strong> at texasattorneygeneral.gov.
      </p>
    </Section>
  </LegalLayout>
);

// ─── Cookie Policy ────────────────────────────────────────────────────────────

export const CookiePage = ({ onBack }: LegalPageProps) => (
  <LegalLayout
    onBack={onBack}
    icon={Cookie}
    title="Cookie Policy"
    subtitle={`Effective Date: ${EFFECTIVE_DATE} · State of ${STATE}`}
  >
    <div className="p-4 bg-navy-50 border border-navy-200 rounded-lg text-navy-800 text-sm">
      This Cookie Policy explains how {COMPANY} uses cookies and similar tracking technologies on our website, consistent with our Privacy Policy and applicable Texas law, including the Texas Data Privacy and Security Act (TDPSA).
    </div>

    <Section title="1. What Are Cookies?">
      <p>
        Cookies are small text files placed on your device when you visit a website. They help the website remember your preferences, understand how you use the site, and improve your experience. Similar technologies include web beacons, pixels, local storage, and session storage, all of which are addressed by this policy.
      </p>
    </Section>

    <Section title="2. Cookies We Use">
      <p>We use the following categories of cookies:</p>

      <div className="space-y-4 mt-2">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-navy-900 mb-1">Strictly Necessary Cookies</h3>
          <p className="text-sm text-gray-600">These cookies are essential for the website to function and cannot be disabled. They include session management and security tokens. No consent is required for these cookies.</p>
          <p className="text-sm font-medium text-gray-700 mt-2">Examples: session state, CSRF protection tokens.</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-navy-900 mb-1">Performance and Analytics Cookies</h3>
          <p className="text-sm text-gray-600">These cookies collect information about how visitors use our website, such as pages visited, time spent, and errors encountered. Data is aggregated and anonymous. We use this information to improve our website.</p>
          <p className="text-sm font-medium text-gray-700 mt-2">Examples: Google Analytics (_ga, _gid), internal performance metrics.</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-navy-900 mb-1">Functional Cookies</h3>
          <p className="text-sm text-gray-600">These cookies allow the website to remember choices you have made (such as language preferences or form data) to provide enhanced, more personalized features.</p>
          <p className="text-sm font-medium text-gray-700 mt-2">Examples: user preference storage, contact form autofill.</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-navy-900 mb-1">Marketing and Targeting Cookies</h3>
          <p className="text-sm text-gray-600">These cookies may be set by our advertising partners to build a profile of your interests and show relevant advertisements on other websites. We do not currently deploy advertising cookies, but this policy will be updated if we do so in the future.</p>
          <p className="text-sm font-medium text-gray-700 mt-2">Current status: Not in use.</p>
        </div>
      </div>
    </Section>

    <Section title="3. Third-Party Cookies">
      <p>
        Some cookies are placed by third-party services appearing on our website. These include:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Stripe:</strong> Used at checkout to process payment securely. Subject to Stripe's Privacy Policy.</li>
        <li><strong>Tawk.to:</strong> Powers our live chat widget. Subject to Tawk.to's Privacy Policy.</li>
        <li><strong>Google Analytics:</strong> Used to track website usage and performance. Data is anonymized where possible. Subject to Google's Privacy Policy and Data Processing Terms.</li>
      </ul>
      <p>
        We do not control third-party cookies and recommend reviewing the privacy policies of these providers directly.
      </p>
    </Section>

    <Section title="4. Your Cookie Choices and Opt-Out Rights">
      <p>
        Under the Texas Data Privacy and Security Act (TDPSA), you have the right to opt out of the processing of your personal data for purposes of targeted advertising or the sale of personal data. We honor these rights as follows:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Browser Settings:</strong> You can instruct your browser to refuse all or some cookies, or to alert you when cookies are being set. Visit <em>aboutcookies.org</em> or your browser's help documentation for instructions. Note that disabling cookies may impair the functionality of our website.
        </li>
        <li>
          <strong>Google Analytics Opt-Out:</strong> You may opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on, available at <em>tools.google.com/dlpage/gaoptout</em>.
        </li>
        <li>
          <strong>Do Not Track (DNT):</strong> Our website respects the DNT browser signal where technically feasible. Enabling DNT in your browser will limit analytics tracking on our site.
        </li>
        <li>
          <strong>Contact Us:</strong> To exercise your TDPSA opt-out rights or request further information, contact us at <strong>{EMAIL}</strong>.
        </li>
      </ul>
    </Section>

    <Section title="5. Cookie Duration">
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Session Cookies:</strong> Deleted when you close your browser.</li>
        <li><strong>Persistent Cookies:</strong> Remain on your device for a set period. Analytics cookies (e.g., Google Analytics _ga) expire after two (2) years. Functional preference cookies expire after one (1) year.</li>
      </ul>
    </Section>

    <Section title="6. Legal Basis Under Texas Law">
      <p>
        Texas does not currently mandate a cookie consent banner equivalent to the EU's GDPR or ePrivacy Directive. However, because some of our visitors may be subject to other jurisdictions, and in the spirit of transparency consistent with the TDPSA's privacy-by-design principles, we provide this full disclosure of our cookie practices and offer meaningful opt-out mechanisms as described above.
      </p>
    </Section>

    <Section title="7. Updates to This Policy">
      <p>
        We may update this Cookie Policy to reflect changes in technology, law, or our practices. The updated policy will be posted on this page with a revised effective date. Continued use of our website following any update constitutes your acknowledgment of the revised policy.
      </p>
    </Section>

    <Section title="8. Contact Us">
      <p>
        If you have questions or concerns about our use of cookies, please contact:<br />
        <strong>{COMPANY}</strong><br />
        {ADDRESS}<br />
        Email: {EMAIL}
      </p>
    </Section>
  </LegalLayout>
);
