import Link from 'next/link';

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Last updated: January 2025</p>

        <div style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '15px' }}>
          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using GUTS (&quot;the Game&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the Game.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              GUTS is an online card game where players compete against AI opponents. The game uses a
              virtual token system for gameplay. Tokens can be purchased with real money but have no
              real-world cash value and cannot be exchanged for cash.
            </p>
          </Section>

          <Section title="3. Account Registration">
            <p>
              To access certain features, you must create an account. You agree to provide accurate
              information and maintain the security of your account credentials. You are responsible
              for all activities under your account.
            </p>
          </Section>

          <Section title="4. Virtual Tokens">
            <ul>
              <li>Tokens are virtual items with no real-world value</li>
              <li>Tokens cannot be exchanged, transferred, or redeemed for cash</li>
              <li>All token purchases are final and non-refundable</li>
              <li>We reserve the right to modify token values and pricing</li>
              <li>Unused tokens may expire according to our policies</li>
            </ul>
          </Section>

          <Section title="5. Prohibited Conduct">
            <p>You agree not to:</p>
            <ul>
              <li>Use automated systems, bots, or scripts</li>
              <li>Exploit bugs or glitches for unfair advantage</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to hack or compromise the Game</li>
              <li>Create multiple accounts to abuse promotions</li>
              <li>Engage in any fraudulent activity</li>
            </ul>
          </Section>

          <Section title="6. Intellectual Property">
            <p>
              All content, graphics, and code are owned by GUTS and protected by intellectual property
              laws. You may not copy, modify, or distribute any part of the Game without permission.
            </p>
          </Section>

          <Section title="7. Termination">
            <p>
              We may suspend or terminate your account at any time for violation of these terms or
              for any other reason. Upon termination, you lose access to any tokens or purchases.
            </p>
          </Section>

          <Section title="8. Disclaimer of Warranties">
            <p>
              The Game is provided &quot;as is&quot; without warranties of any kind. We do not guarantee
              uninterrupted or error-free service.
            </p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>
              We shall not be liable for any indirect, incidental, or consequential damages arising
              from your use of the Game.
            </p>
          </Section>

          <Section title="10. Changes to Terms">
            <p>
              We may update these terms at any time. Continued use of the Game after changes
              constitutes acceptance of the new terms.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>
              For questions about these terms, please contact us through the Game&apos;s support channels.
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
