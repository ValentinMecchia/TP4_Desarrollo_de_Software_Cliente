import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export function Logo({ size = 'md', className, showText = true }) {
  const iconSize = size === 'sm' ? 20 : size === 'md' ? 28 : 36;
  const textSize = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-3xl';

  return (
    <Link to={ROUTES.HOME} className={`flex items-center gap-2 ${className}`}>
      <ShieldCheck className="text-primary" size={iconSize} />
      {showText && (
        <span className={`font-headline font-bold text-primary ${textSize}`}>
          SmartVest
        </span>
      )}
    </Link>
  );
}
