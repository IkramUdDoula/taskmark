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
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50">
      <div className="flex items-center space-x-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Install TaskMark
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Install this app on your device for quick and easy access
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-[#1A3636] text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Install
          </button>
          <button
            onClick={() => setShowInstallPrompt(false)}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdatePrompt; 