"use client";


interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 5,
  className = "",
}: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`text-transparent bg-clip-text inline-block ${
        disabled ? "" : "animate-shine"
      } ${className}`}
      style={{
        backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration: animationDuration,
        backgroundColor: 'rgba(255, 255, 255, 0.4)', // Base color for the text
      }}
    >
      {text}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shine {
          0% { background-position: 100% 50%; }
          100% { background-position: -100% 50%; }
        }
        .animate-shine {
          animation: shine linear infinite;
        }
      `}} />
    </div>
  );
}
