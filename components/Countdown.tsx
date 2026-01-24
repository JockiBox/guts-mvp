'use client';

interface CountdownProps {
  value: number;
}

export function Countdown({ value }: CountdownProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div
        key={value}
        className="animate-countdown text-9xl font-black text-teal-400 drop-shadow-[0_0_30px_rgba(20,184,166,0.8)]"
      >
        {value}
      </div>
    </div>
  );
}
