class WalletService {
  private static generateTONAddress(): string {
    const prefix = 'UQ';
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomPart = Array.from({ length: 46 }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
    return prefix + randomPart;
  }

  static async connectWallet(): Promise<{ address: string }> {
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const address = this.generateTONAddress();
    return { address };
  }

  static async getBalance(): Promise<number> { // Removed address parameter
    // In real implementation, this would query the blockchain
    // For mock, we'll get from our database
    return 0;
  }

  static formatTON(amount: number): string {
    return `${amount.toFixed(2)} TON`;
  }
}

export default WalletService;
