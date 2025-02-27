import React from 'react';

interface LoginModalProps {
  showModal: boolean;
  onClose: () => void;
  onLogin: (success: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ showModal, onClose, onLogin }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username === 'admin' && password === 'secret');
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="glass p-8 rounded-2xl w-full max-w-md mx-4 modal-content">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Login</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-blue-500 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-blue-500 text-white"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-gradient px-6 py-2 rounded-lg">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;