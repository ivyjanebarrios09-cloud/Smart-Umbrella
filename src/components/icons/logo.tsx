import Image from 'next/image';

export function Logo(props: { className?: string }) {
  return (
    <div className={`relative ${props.className}`}>
      <Image
        src="/image/logoo.png"
        alt="UmbraGuard Logo"
        fill
        className="object-contain"
      />
    </div>
  );
}
