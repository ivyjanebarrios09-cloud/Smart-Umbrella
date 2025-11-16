import Image from 'next/image';

export function Logo(props: { className?: string }) {
  return (
    <div className={`relative ${props.className}`}>
      <Image
        src="/image/logoo.png"
        alt="Smart Umbrella Tracker Logo"
        fill
        className="object-contain"
      />
    </div>
  );
}
