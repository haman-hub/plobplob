export const initTelegramApp = () => {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Expand to full height
    tg.expand();
    
    // Enable closing confirmation
    tg.enableClosingConfirmation();
    
    // Set background color
    tg.setBackgroundColor('#f9fafb');
    
    // Set header color
    tg.setHeaderColor('#0088cc');
    
    return tg;
  }
  return null;
};

export const getTelegramTheme = () => {
  if (window.Telegram?.WebApp?.themeParams) {
    return window.Telegram.WebApp.themeParams;
  }
  return {
    bg_color: '#ffffff',
    text_color: '#000000',
    hint_color: '#999999',
    link_color: '#0088cc',
    button_color: '#0088cc',
    button_text_color: '#ffffff'
  };
};

export const showTelegramAlert = (message: string) => {
  if (window.Telegram?.WebApp?.showAlert) {
    window.Telegram.WebApp.showAlert(message);
  } else {
    alert(message);
  }
};

export const showTelegramConfirm = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Telegram?.WebApp?.showConfirm) {
      window.Telegram.WebApp.showConfirm(message, (confirmed: boolean) => { // Added type
        resolve(confirmed);
      });
    } else {
      const confirmed = window.confirm(message);
      resolve(confirmed);
    }
  });
};
