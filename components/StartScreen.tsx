'use client';

interface StartScreenProps {
  onStart: (playerCount: number) => void;
  resultMessage?: string;
  playerCount: number;
  setPlayerCount: (count: number) => void;
}

export function StartScreen({ onStart, resultMessage, playerCount, setPlayerCount }: StartScreenProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}
    >
      <div
        style={{
          background: '#1e293b',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #2dd4bf, #22d3ee)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '8px',
          }}
        >
          GUTS
        </h1>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
          High-Stakes 2-Card Poker Showdown
        </p>

        {resultMessage && (
          <div
            style={{
              background: '#0f172a',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              color: '#fbbf24',
              fontWeight: 'bold',
              border: '1px solid #334155',
            }}
          >
            {resultMessage}
          </div>
        )}

        {/* Player Count Selector */}
        <div
          style={{
            background: '#0f172a',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid #334155',
          }}
        >
          <h2
            style={{
              fontWeight: 'bold',
              color: '#14b8a6',
              marginBottom: '12px',
              fontSize: '16px',
            }}
          >
            Number of Players
          </h2>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'center',
            }}
          >
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                onClick={() => setPlayerCount(num)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: playerCount === num ? '2px solid #14b8a6' : '1px solid #334155',
                  background: playerCount === num ? '#14b8a6' : '#1e293b',
                  color: playerCount === num ? '#0f172a' : '#94a3b8',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {num}
              </button>
            ))}
          </div>
          <p style={{ color: '#64748b', fontSize: '12px', marginTop: '8px' }}>
            1 human + {playerCount - 1} AI opponents
          </p>
        </div>

        {/* Rules */}
        <div
          style={{
            background: '#0f172a',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'left',
            border: '1px solid #334155',
          }}
        >
          <h2
            style={{
              fontWeight: 'bold',
              color: '#14b8a6',
              marginBottom: '12px',
              fontSize: '16px',
            }}
          >
            How to Play
          </h2>
          <ol style={{ fontSize: '14px', color: '#cbd5e1', margin: 0, padding: 0, listStyle: 'none' }}>
            <li style={{ marginBottom: '8px' }}>
              <span style={{ color: '#14b8a6', fontWeight: 'bold' }}>1.</span> Each player antes 1
              token and receives 2 cards
            </li>
            <li style={{ marginBottom: '8px' }}>
              <span style={{ color: '#14b8a6', fontWeight: 'bold' }}>2.</span> During the 3-second
              countdown, choose to <span style={{ color: '#4ade80' }}>HOLD</span> or{' '}
              <span style={{ color: '#f87171' }}>DROP</span>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <span style={{ color: '#14b8a6', fontWeight: 'bold' }}>3.</span> If you{' '}
              <span style={{ color: '#4ade80' }}>HOLD</span>, you compete for the pot
            </li>
            <li style={{ marginBottom: '8px' }}>
              <span style={{ color: '#14b8a6', fontWeight: 'bold' }}>4.</span> Winner takes the pot,
              losers <span style={{ color: '#fbbf24' }}>match the pot</span>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <span style={{ color: '#14b8a6', fontWeight: 'bold' }}>5.</span> If everyone drops, a{' '}
              <span style={{ color: '#c084fc' }}>Ghost Hand</span> joins!
            </li>
            <li style={{ marginBottom: '0' }}>
              <span style={{ color: '#14b8a6', fontWeight: 'bold' }}>6.</span> Lose to a ghost?{' '}
              <span style={{ color: '#ef4444' }}>DOUBLE</span> the pot!
            </li>
          </ol>
        </div>

        {/* Hand Rankings */}
        <div
          style={{
            background: '#0f172a',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'left',
            border: '1px solid #334155',
          }}
        >
          <h2
            style={{
              fontWeight: 'bold',
              color: '#14b8a6',
              marginBottom: '12px',
              fontSize: '16px',
            }}
          >
            Hand Rankings
          </h2>
          <div style={{ fontSize: '14px', color: '#cbd5e1' }}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}
            >
              <span style={{ color: '#f472b6', fontWeight: 'bold' }}>★ SIX-NINE</span>
              <span style={{ color: '#f472b6' }}>BEST HAND!</span>
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}
            >
              <span style={{ color: '#fbbf24' }}>2. Pair</span>
              <span style={{ color: '#64748b' }}>Two of same rank</span>
            </div>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}
            >
              <span style={{ color: '#fbbf24' }}>3. Flush</span>
              <span style={{ color: '#64748b' }}>Two of same suit</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#fbbf24' }}>4. High Card</span>
              <span style={{ color: '#64748b' }}>Highest card wins</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => onStart(playerCount)}
          style={{
            padding: '16px 32px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white',
            width: '100%',
            background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(20, 184, 166, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(20, 184, 166, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(20, 184, 166, 0.4)';
          }}
        >
          {resultMessage ? 'PLAY AGAIN' : `START GAME (${playerCount} Players)`}
        </button>
      </div>
    </div>
  );
}
