import { ShieldCheck } from 'lucide-react'; // Example icon
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export function Logo({ size = 'md', className, showText = true }: LogoProps) {
  const iconSize = size === 'sm' ? 20 : size === 'md' ? 28 : 36;
  const textSize = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-3xl';

  return (
    <Link href={ROUTES.HOME} className={`flex items-center gap-2 ${className}`}>
      <ShieldCheck className="text-primary" size={iconSize} />
      {showText && (
        <span className={`font-headline font-bold text-primary ${textSize}`}>
          Smartfolio Sentinel
        </span>
      )}
    </Link>
  );
}
