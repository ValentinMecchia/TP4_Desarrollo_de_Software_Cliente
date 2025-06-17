import React from 'react';

export default function TermsOfService() {
    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md mt-12 mb-12">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Términos y Condiciones</h1>
            <p className="mb-4 text-gray-700 leading-relaxed">
                Al acceder y usar SmartVest, aceptás cumplir con estos términos y condiciones. Por favor, leelos cuidadosamente.
            </p>

            <h2 className="text-xl font-semibold mb-2 text-gray-800">1. Uso de la Aplicación</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
                La aplicación SmartVest está diseñada para ayudarte a gestionar inversiones y portafolios financieros personales.
                Te comprometés a usarla responsablemente, sin intentar vulnerar su seguridad o alterar su funcionamiento.
            </p>

            <h2 className="text-xl font-semibold mb-2 text-gray-800">2. Registro y Seguridad</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
                Para acceder a ciertas funciones, es necesario registrarse y autenticarte.
                Sos responsable de mantener la confidencialidad de tu cuenta y contraseña.
                Notificanos inmediatamente si detectás uso no autorizado.
            </p>

            <h2 className="text-xl font-semibold mb-2 text-gray-800">3. Limitación de Responsabilidad</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
                SmartVest proporciona información financiera basada en fuentes públicas, pero no garantizamos exactitud o actualización.
                No somos responsables por decisiones financieras que tomés basadas en nuestra aplicación.
            </p>

            <h2 className="text-xl font-semibold mb-2 text-gray-800">4. Modificaciones</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
                Estos términos pueden cambiar en cualquier momento.
                Se recomienda revisarlos periódicamente para estar informado sobre actualizaciones.
            </p>

            <h2 className="text-xl font-semibold mb-2 text-gray-800">5. Terminación</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
                Podemos suspender o cancelar tu acceso si violás estos términos o por razones legales.
            </p>

            <p className="text-gray-600 mt-8 text-sm">
                © 2025 SmartVest. Todos los derechos reservados.
            </p>
        </div>
    );
}
