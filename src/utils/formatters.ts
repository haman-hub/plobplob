export const formatTON = (amount: number): string => {
  return `${amount.toFixed(2)} TON`;
};

export const formatUSD = (amount: number, tonPrice: number = 2.5): string => {
  return `$${(amount * tonPrice).toFixed(2)}`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  if (address.length <= 16) return address;
  return `${address.slice(0, 8)}...${address.slice(-8)}`;
};

export const validateTONAddress = (address: string): boolean => {
  if (!address) return false;
  // Basic TON address validation
  return address.startsWith('UQ') && address.length === 48;
};