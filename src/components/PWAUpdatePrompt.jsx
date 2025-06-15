import { useState, useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';

const PWAUpdatePrompt = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Handle PWA updates
    const updateSW = registerSW({
      onNeedRefresh() {
        if (confirm('New content available. Reload?')) {
          updateSW();
        }
      },
      onOfflineReady() {
        console.log('App ready to work offline');
      },
      immediate: true
    });

    // Handle install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    });

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
      setShowInstallPrompt(false);
      console.log('PWA was installed');
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)'
      }}
    >
      <div className="flex items-center space-x-4">
        <div>
          <h3 className="text-lg font-semibold">
            Install TaskMark
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Install this app on your device for quick and easy access
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleInstall}
            className="px-4 py-2 rounded-md transition-colors"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-primary)'
            }}
          >
            Install
          </button>
          <button
            onClick={() => setShowInstallPrompt(false)}
            className="px-4 py-2 rounded-md transition-colors"
            style={{
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-tertiary)'
            }}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdatePrompt; 