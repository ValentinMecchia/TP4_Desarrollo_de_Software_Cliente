import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

// size: 'sm' para logo pequeño, 'md' para mediano, cualquier otro valor para grande
// showText: true muestra el logo completo, false solo el icono
export function Logo({ size = 'md', className, showText = true }) {
  const iconSize = size === 'sm' ? 50 : size === 'md' ? 200 : 48;

  // Puedes poner solo height={iconSize} y dejar width sin definir,
  // o poner width="auto" y height={iconSize}, así el navegador mantiene la proporción original de la imagen.
  // Lo más simple y efectivo es solo definir height y NO poner width.

  return (
    <Link to={ROUTES.HOME} className={`flex items-center gap-2 ${className}`}>
      {showText ? (
        <img
          src='/Completo.png'
          alt="Logo"
          height={iconSize}
          style={{ height: iconSize, width: 'auto', maxHeight: iconSize }}
        />
      ) : (
        <img
          src='/Logo.png'
          alt="Logo"
          height={iconSize}
          style={{ height: iconSize, width: 'auto', maxHeight: iconSize, filter: 'invert(1)' }}
        />
      )}
    </Link>
  );
}
