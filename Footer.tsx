import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="glass mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <div className="space-y-2 text-gray-300">
              <p>support@meldungssystem.de</p>
              <p>+49 123 456 789</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Datenschutz</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Impressum</a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Über uns</h3>
            <p className="text-gray-300">Ein modernes System zur effizienten Erfassung und Bearbeitung von Vorfällen.</p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-gray-400">
          © 2024 Meldungssystem. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
};

export default Footer;