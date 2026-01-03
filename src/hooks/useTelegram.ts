import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

export const useTelegram = () => {
  const [telegram, setTelegram] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.expand();
      tg.enableClosingConfirmation();
      setTelegram(tg);
      setIsInitialized(true);
    }
  }, []);

  return {
    telegram,
    isInitialized,
    initData: telegram?.initData || '',
    initDataUnsafe: telegram?.initDataUnsafe || {},
    user: telegram?.initDataUnsafe?.user,
    themeParams: telegram?.themeParams || {},
    platform: telegram?.platform || 'unknown'
  };
};