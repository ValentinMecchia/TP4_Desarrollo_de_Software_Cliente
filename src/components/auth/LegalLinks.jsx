import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const LegalLinks = () => {
    return (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 text-sm text-gray-600">
            <p>
                Al continuar, aceptás nuestra{' '}
                <Link to={ROUTES.PRIVACYPOLICY} className="text-blue-600 hover:underline">
                    Política de Privacidad
                </Link>
                {' '}y nuestros{' '}
                <Link to={ROUTES.TERMS} className="text-blue-600 hover:underline">
                    Términos y Condiciones
                </Link>.
            </p>
        </div>
    );
};

export default LegalLinks;
