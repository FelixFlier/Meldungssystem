import React from 'react';

interface ProgressBarProps {
    showProgress: boolean;
    progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ showProgress, progress }) => {
    if (!showProgress) return null;
  
    let statusText = '';
    if (progress < 25) statusText = 'Prozess wird gestartet...';
    else if (progress < 50) statusText = 'Daten werden verarbeitet...';
    else if (progress < 75) statusText = 'Formular wird ausgefüllt...';
    else if (progress < 100) statusText = 'Abschluss wird vorbereitet...';
    else statusText = 'Prozess abgeschlossen!';


    return (
        <div id="progress-container" className="fixed bottom-8 right-8 w-80 glass rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{statusText}</span>
                <span className="text-sm font-medium text-white">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full w-0 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;