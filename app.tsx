import React from 'react';
import Navbar from './components/Navbar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import DateTimeModal from './components/DateTimeModal';
import ProgressBar from './components/ProgressBar';
import ToastContainer from './components/ToastContainer';
import SparklesBackground from './components/SparklesBackground';

function App() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [showLoginModal, setShowLoginModal] = React.useState(false);
    const [showDateTimeModal, setShowDateTimeModal] = React.useState(false);
    const [incidentType, setIncidentType] = React.useState<string | null>(null);
    const [toastMessages, setToastMessages] = React.useState<
        { id: number; message: string; type: 'info' | 'success' | 'error' }[]
    >([]);
    const [showProgress, setShowProgress] = React.useState(false);
    const [progress, setProgress] = React.useState(0); // Progress-Wert

    const addToastMessage = (message: string, type: 'info' | 'success' | 'error') => {
        const id = Date.now();
        setToastMessages((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToastMessages((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    };

    const handleLogin = (success: boolean) => {
        if (success) {
            setIsLoggedIn(true);
            setShowLoginModal(false);
            addToastMessage('Erfolgreich eingeloggt!', 'success');
        } else {
            addToastMessage('Ungültige Anmeldedaten!', 'error');
        }
    };

    const handleAgentClick = (type: string) => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }
        setIncidentType(type);
        setShowDateTimeModal(true);
    };

    const handleDateTimeSubmit = async (
        date: string,
        time: string,
        excelData: any[] | null
    ) => {
        setShowDateTimeModal(false);
        setShowProgress(true);
        setProgress(0); // Progress zurücksetzen

        //Simuliere einen Fortschritt
        const interval = setInterval(() => {
          setProgress((prevProgress) => {
            const newProgress = prevProgress + (prevProgress < 30 ? 1 : prevProgress < 70 ? 0.7 : 0.3);
            return Math.min(100, newProgress);
          });
        }, 500);

        try {
            const response = await fetch('/execute-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: incidentType,
                    datetime: { date, time },
                    excelData,
                }),
            });

            const data = await response.json();
            if (data.success) {
                addToastMessage('Vorgang wurde erfolgreich gestartet', 'success');
            } else {
                throw new Error(data.message || 'Unbekannter Fehler');
            }
        } catch (error:any) {
            addToastMessage(error.message, 'error');
        } finally
        {
          clearInterval(interval);
          setTimeout(() => {
              setShowProgress(false);
              setProgress(0);
          }, 500);
        }
    };

    return (
        <div className="text-white min-h-screen" style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            backgroundColor: "#040b1a",
            backgroundImage: `radial-gradient(circle at bottom center, #0C1737 0%, #040b1a 70%), linear-gradient(135deg, rgba(50, 167, 255, 0.1) 0%, transparent 100%)`,
        }}>
            <SparklesBackground />
            <Navbar isLoggedIn={isLoggedIn} onLoginClick={() => setShowLoginModal(true)} />
            <MainContent onAgentClick={handleAgentClick} />
            <Footer />
            <LoginModal showModal={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
            <DateTimeModal
                showModal={showDateTimeModal}
                onClose={() => setShowDateTimeModal(false)}
                onSubmit={handleDateTimeSubmit}
                incidentType={incidentType}
                addToastMessage={addToastMessage}
            />
            <ProgressBar showProgress={showProgress} progress={progress} />
            <ToastContainer messages={toastMessages} />
        </div>
    );
}

export default App;