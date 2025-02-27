import React from 'react';

interface MainContentProps {
  onAgentClick: (type: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ onAgentClick }) => {
  return (
    <main className="container mx-auto pt-24 pb-16 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-200 to-green-400 bg-clip-text text-transparent">
            VORFALL MELDEN
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Bitte wählen Sie die Art des Vorfalls aus, um mit der Meldung zu beginnen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <button
            onClick={() => onAgentClick('diebstahl')}
            className="glass card-hover p-8 rounded-2xl text-center group"
          >
            <div className="mb-6 transform transition-transform group-hover:scale-110 duration-300">
              <span className="text-6xl">🛡️</span>
            </div>
            <h3 className="text-2xl font-semibold mb-3">Diebstahl</h3>
            <p className="text-gray-400">Melden Sie einen Diebstahl oder Eigentumsdelikt</p>
          </button>

          <button
            onClick={() => onAgentClick('sachbeschaedigung')}
            className="glass card-hover p-8 rounded-2xl text-center group"
          >
            <div className="mb-6 transform transition-transform group-hover:scale-110 duration-300">
              <span className="text-6xl">🔨</span>
            </div>
            <h3 className="text-2xl font-semibold mb-3">Sachbeschädigung</h3>
            <p className="text-gray-400">Melden Sie eine Beschädigung von Eigentum</p>
          </button>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="glass p-4 rounded-xl flex items-center justify-center space-x-3">
            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p className="text-yellow-100">Ihre Meldung wird vertraulich behandelt.</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;