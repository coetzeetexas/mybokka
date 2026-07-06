import { ArrowLeft, Shield, FileText, Cookie } from 'lucide-react';

const EFFECTIVE_DATE = 'June 14, 2026';
const COMPANY = 'KORIX LLC';
const STATE = 'Texas';
const EMAIL = 'korixllc@outlook.com';
const ADDRESS = 'Fort Worth, Dallas, Texas, USA';

interface LegalPageProps {
  onBack: () => void;
}

const LegalLayout = ({
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

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
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
        These Terms and Conditions ("Agreement") constitute a legally binding contract between {COMPANY}, a Texas limited liability company ("Company," "we," "us," or "our"), and you ("Client," "you," or "your"). This Agreement governs your use of our website at korixllc.com and all professional services provided by {COMPANY}, including AI training, AI consulting, and social media management services.
      </p>
      <p>
        {COMPANY} is organized and in good standing under the Texas Business Organizations Code, Chapter 101 (Texas Limited Liability Company Act).
      </p>
    </Section>

    <Section title="2. Services">
      <p>
        {COMPANY} provides the following categories of professional services:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>AI Training:</strong> Educational workshops, employee training sessions, prompt engineering instruction, and AI productivity system development.</li>
        <li><strong>AI Consulting:</strong> AI readiness assessments, business process automation consulting, workflow optimization, AI strategy development, and AI tool selection and implementation.</li>
        <li><strong>Social Media Management:</strong> Content strategy, content creation, social media scheduling, community management, analytics and reporting, and brand growth campaigns.</li>
      </ul>
      <p>
        Specific deliverables, timelines, and fees for each engagement shall be set forth in a separate Statement of Work ("SOW") or Service Agreement executed by both parties.
      </p>
    </Section>

    <Section title="3. Payment Terms">
      <p>
        All fees are stated in United States Dollars (USD). Invoices are due and payable within thirty (30) days of the invoice date unless otherwise specified in the applicable SOW. Overdue balances accrue interest at the rate of one and one-half percent (1.5%) per month, or the maximum rate permitted by Texas law under Texas Finance Code § 302.001, whichever is lower.
      </p>
      <p>
        {COMPANY} reserves the right to suspend services for accounts more than thirty (30) days past due after providing written notice to the Client.
      </p>
    </Section>

    <Section title="4. Intellectual Property">
      <p>
        <strong>Company IP:</strong> All methodologies, frameworks, proprietary tools, templates, and pre-existing materials used by {COMPANY} remain the exclusive intellectual property of {COMPANY}.
      </p>
      <p>
        <strong>Work Product:</strong> Unless expressly stated otherwise in a signed SOW, upon receipt of full payment, {COMPANY} grants Client a non-exclusive, non-transferable license to use deliverables created specifically for Client under the applicable engagement.
      </p>
      <p>
        <strong>Client Materials:</strong> Client retains ownership of all materials, data, and content provided to {COMPANY} for the purpose of delivering services. Client grants {COMPANY} a limited license to use such materials solely to perform the contracted services.
      </p>
    </Section>

    <Section title="5. Confidentiality">
      <p>
        Both parties agree to hold in strict confidence any proprietary or sensitive information ("Confidential Information") disclosed during the engagement. This obligation survives termination of the Agreement for a period of three (3) years. Confidential Information does not include information that: (a) is or becomes publicly known through no breach of this Agreement; (b) is rightfully received from a third party without restriction; or (c) is required to be disclosed by law or court order, provided the disclosing party gives prompt written notice.
      </p>
    </Section>

    <Section title="6. Limitation of Liability">
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY TEXAS LAW, {COMPANY.toUpperCase()}'S TOTAL LIABILITY ARISING OUT OF OR RELATING TO THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID BY CLIENT IN THE THREE (3) MONTHS PRECEDING THE CLAIM. IN NO EVENT SHALL {COMPANY.toUpperCase()} BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS OR REVENUE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
      </p>
    </Section>

    <Section title="7. Disclaimer of Warranties">
      <p>
        SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. {COMPANY.toUpperCase()} MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. {COMPANY} DOES NOT WARRANT THAT AI TOOLS OR STRATEGIES WILL PRODUCE ANY SPECIFIC BUSINESS OUTCOME OR REVENUE RESULT.
      </p>
    </Section>

    <Section title="8. Indemnification">
      <p>
        Client agrees to indemnify, defend, and hold harmless {COMPANY} and its members, managers, officers, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising out of or relating to: (a) Client's use of the services or deliverables; (b) Client's breach of this Agreement; or (c) any content or materials provided by Client to {COMPANY}.
      </p>
    </Section>

    <Section title="9. Term and Termination">
      <p>
        This Agreement begins on the date Client first uses our services or accepts these terms and continues until terminated. Either party may terminate an engagement with thirty (30) days' written notice. {COMPANY} may terminate immediately for cause, including non-payment or material breach. Upon termination, Client shall pay for all services rendered through the termination date.
      </p>
    </Section>

    <Section title="10. Governing Law and Dispute Resolution">
      <p>
        This Agreement shall be governed exclusively by the laws of the State of Texas, without regard to its conflict-of-laws principles. Any dispute arising under or related to this Agreement shall first be submitted to non-binding mediation in Dallas County, Texas. If mediation is unsuccessful, disputes shall be resolved by binding arbitration under the American Arbitration Association Commercial Arbitration Rules, seated in Dallas, Texas. Notwithstanding the foregoing, either party may seek injunctive or equitable relief in any court of competent jurisdiction in Dallas County, Texas.
      </p>
      <p>
        The parties expressly agree that the Texas Deceptive Trade Practices-Consumer Protection Act (DTPA), Tex. Bus. & Com. Code §§ 17.41–17.63, does not apply to services rendered under this Agreement where Client is a business entity or person who has assets of $25,000 or more, consistent with § 17.49(g).
      </p>
    </Section>

    <Section title="11. Force Majeure">
      <p>
        Neither party shall be liable for delays or failures in performance resulting from causes beyond its reasonable control, including natural disasters, acts of government, power failures, internet disruptions, or other events of force majeure, provided the affected party gives prompt written notice.
      </p>
    </Section>

    <Section title="12. Entire Agreement and Amendments">
      <p>
        This Agreement, together with any applicable SOW, constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements. {COMPANY} reserves the right to modify these Terms at any time. Material changes will be communicated via email or prominent website notice at least fourteen (14) days prior to taking effect. Continued use of services after the effective date constitutes acceptance.
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
        <li><strong>Contact and Identity Data:</strong> Name, email address, phone number, company name, job title.</li>
        <li><strong>Communication Data:</strong> Messages submitted via our contact form or email correspondence.</li>
        <li><strong>Usage Data:</strong> IP address, browser type and version, pages visited, time spent, referring URLs, and other diagnostic data collected automatically when you visit our website.</li>
        <li><strong>Technical Data:</strong> Device identifiers, operating system, and browser settings.</li>
        <li><strong>Business Data:</strong> Information provided in the course of service engagements, including business goals, operational data, and strategy documents shared with us.</li>
      </ul>
      <p>We do not knowingly collect sensitive personal data as defined by TDPSA § 541.002(18) (including racial or ethnic origin, religious beliefs, health data, biometric data, precise geolocation, or data concerning minors) without explicit consent.</p>
    </Section>

    <Section title="3. How We Collect Personal Data">
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Directly from you:</strong> When you fill out our contact form, book a consultation, or correspond with us.</li>
        <li><strong>Automatically:</strong> Through cookies and similar technologies when you browse our website (see our Cookie Policy).</li>
        <li><strong>From third parties:</strong> Publicly available business directories or referral partners, consistent with their own privacy policies.</li>
      </ul>
    </Section>

    <Section title="4. Purposes and Legal Basis for Processing">
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Service Delivery:</strong> To fulfill contracts, respond to inquiries, and provide AI training, consulting, and social media services.</li>
        <li><strong>Business Communications:</strong> To send quotes, invoices, project updates, and respond to support requests.</li>
        <li><strong>Marketing (with consent):</strong> To send newsletters or promotional information about our services. You may opt out at any time.</li>
        <li><strong>Website Analytics:</strong> To understand how visitors interact with our site and improve user experience.</li>
        <li><strong>Legal Compliance:</strong> To comply with applicable Texas and federal laws and regulations.</li>
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
        <li><strong>Service Providers:</strong> Trusted vendors who assist with website hosting, email delivery, analytics, and CRM, bound by data processing agreements.</li>
        <li><strong>Professional Advisors:</strong> Attorneys, accountants, or insurers under confidentiality obligations.</li>
        <li><strong>Legal Authorities:</strong> When required by Texas or federal law, court order, or to protect the rights, property, or safety of {COMPANY} or others.</li>
        <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or asset sale, subject to continued compliance with this Policy.</li>
      </ul>
    </Section>

    <Section title="7. Data Retention">
      <p>
        We retain personal data only as long as necessary to fulfill the purposes described in this Policy, plus any additional period required by Texas law or legitimate business need. Contact form data is retained for up to three (3) years. Client engagement data is retained for seven (7) years in accordance with standard Texas business recordkeeping practices. You may request earlier deletion subject to our legal obligations.
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
        <li><strong>Google Maps:</strong> Used to embed location maps on our contact page. Subject to Google's Privacy Policy.</li>
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
