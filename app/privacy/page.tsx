import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        padding: '40px 20px',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#14b8a6',
            textDecoration: 'none',
            marginBottom: '24px',
            fontSize: '14px',
          }}
        >
          ← Back to Game
        </Link>

        <h1 style={{ color: '#14b8a6', fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
          Privacy Policy
        </h1>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Last updated: January 2025</p>

        <div style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '15px' }}>
          <Section title="1. Information We Collect">
            <p>We collect information you provide when creating an account:</p>
            <ul>
              <li>Email address</li>
              <li>Username</li>
              <li>Password (encrypted)</li>
              <li>Profile customizations (avatar, colors)</li>
            </ul>
            <p>We automatically collect:</p>
            <ul>
              <li>Game statistics (wins, losses, tokens)</li>
              <li>Device and browser information</li>
              <li>IP address and general location</li>
              <li>Usage patterns and preferences</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use collected information to:</p>
            <ul>
              <li>Provide and improve the Game</li>
              <li>Process purchases and transactions</li>
              <li>Send important updates and notifications</li>
              <li>Prevent fraud and ensure security</li>
              <li>Analyze usage to improve features</li>
              <li>Comply with legal obligations</li>
            </ul>
          </Section>

          <Section title="3. Information Sharing">
            <p>We may share your information with:</p>
            <ul>
              <li>Payment processors (Stripe) for transactions</li>
              <li>Service providers who help operate the Game</li>
              <li>Law enforcement when legally required</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </Section>

          <Section title="4. Data Security">
            <p>
              We implement industry-standard security measures to protect your data, including:
            </p>
            <ul>
              <li>Encryption of sensitive data</li>
              <li>Secure HTTPS connections</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
            </ul>
          </Section>

          <Section title="5. Your Rights">
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </Section>

          <Section title="6. Cookies">
            <p>
              We use cookies and similar technologies to maintain your session, remember preferences,
              and analyze usage. You can control cookies through your browser settings.
            </p>
          </Section>

          <Section title="7. Children&apos;s Privacy">
            <p>
              The Game is not intended for children under 13. We do not knowingly collect information
              from children. If you believe a child has provided us information, please contact us.
            </p>
          </Section>

          <Section title="8. International Users">
            <p>
              Your information may be transferred and processed in countries outside your residence.
              We ensure appropriate safeguards are in place for such transfers.
            </p>
          </Section>

          <Section title="9. Changes to Privacy Policy">
            <p>
              We may update this policy periodically. We will notify you of significant changes
              through the Game or via email.
            </p>
          </Section>

          <Section title="10. Contact Us">
            <p>
              For privacy-related questions or to exercise your rights, please contact us through
              the Game&apos;s support channels or email us at privacy@guts-game.com.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ color: '#14b8a6', fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
        {title}
      </h2>
      <div style={{ color: '#94a3b8' }}>{children}</div>
    </div>
  );
}
