import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md mt-12 mb-12">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Política de Privacidad</h1>
            <p className="mb-6 text-gray-700 leading-relaxed">
                En SmartVest valoramos tu privacidad. Esta política explica qué datos recopilamos, cómo los usamos y protegemos.
            </p>

            <h2 className="text-xl font-semibold mb-2 text-gray-800">1. Datos que Recopilamos</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
                Recopilamos datos personales que proporcionás al registrarte, como:
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1">
                <li>Nombre y correo electrónico.</li>
                <li>Datos de autenticación (tokens, sesiones).</li>
                <li>Información sobre tu uso de la aplicación para mejorarla.</li>
            </ul>

            <h2 className="text-xl font-semibold mb-2 text-gray-800">2. Uso de los Datos</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
                Utilizamos tus datos para:
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1">
                <li>Gestionar tu cuenta y autenticación segura.</li>
                <li>Personalizar tu experiencia dentro de la app.</li>
                <li>Mejorar y mantener la aplicación.</li>
                <li>Comunicarnos con vos para soporte y actualizaciones.</li>
            </ul>

            <h2 className="text-xl font-semibold mb-2 text-gray-800">3. Protección de la Información</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
                Implementamos medidas de seguridad estándar para proteger tus datos contra accesos no autorizados, pérdida o alteración.
            </p>

            <h2 className="text-xl font-semibold mb-2 text-gray-800">4. Compartir Datos</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
                No vendemos ni compartimos tus datos personales con terceros para fines comerciales. Podemos compartir datos con servicios que usen la aplicación (ejemplo: Google OAuth) solo para autenticación.
            </p>

            <h2 className="text-xl font-semibold mb-2 text-gray-800">5. Tus Derechos</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
                Tenés derecho a solicitar acceso, corrección o eliminación de tus datos personales contactándonos a <a href="mailto:soporte@smartvest.com" className="text-blue-600 underline">soporte@smartvest.com</a>.
            </p>

            <p className="text-gray-600 mt-8 text-sm">
                © 2025 SmartVest. Todos los derechos reservados.
            </p>
        </div>
    );
}