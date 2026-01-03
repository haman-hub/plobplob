import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Copy, Check, Key, PlusCircle } from 'lucide-react';
import { mockDB } from '../../services/mockDatabase';
import WalletService from '../../services/walletService';

const WalletConnect: React.FC = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

  const user = mockDB.getCurrentUser();

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const { address } = await WalletService.connectWallet();
      setConnectedAddress(address);
      
      // Update user with wallet address
      if (user) {
        mockDB.updateUser(user.id, { 
          walletAddress: address,
          balance: user.balance + 10 // Add some test TON
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleUseManualAddress = () => {
    if (manualAddress && user) {
      mockDB.updateUser(user.id, { 
        walletAddress: manualAddress,
        balance: user.balance + 10
      });
      navigate('/marketplace');
    }
  };

  const handleCopyAddress = () => {
    if (connectedAddress) {
      navigator.clipboard.writeText(connectedAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddTestTON = () => {
    if (user) {
      mockDB.updateUser(user.id, { balance: user.balance + 50 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0088cc] rounded-2xl mb-6">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h1>
          <p className="text-gray-600">Connect your TON wallet to start trading</p>
        </div>

        {/* Main Connection Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="space-y-6">
            {/* Wallet Provider Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting || !!connectedAddress}
                className="w-full bg-gradient-to-r from-[#0088cc] to-blue-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Connecting...</span>
                  </>
                ) : connectedAddress ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Wallet Connected</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    <span>Connect Tonkeeper</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowManualInput(!showManualInput)}
                className="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:border-[#0088cc] hover:text-[#0088cc] transition-all"
              >
                <Key className="w-5 h-5" />
                <span>Manual Address Input</span>
              </button>
            </div>

            {/* Manual Address Input */}
            {showManualInput && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter TON Address
                  </label>
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="UQ..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0088cc] focus:border-transparent outline-none"
                  />
                </div>
                <button
                  onClick={handleUseManualAddress}
                  disabled={!manualAddress}
                  className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-black transition-all disabled:opacity-50"
                >
                  Use This Address
                </button>
              </div>
            )}

            {/* Connected Wallet Info */}
            {connectedAddress && (
              <div className="bg-blue-50 rounded-xl p-4 animate-fadeIn">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Connected Address</span>
                  <button
                    onClick={handleCopyAddress}
                    className="text-[#0088cc] hover:text-blue-700"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <code className="text-xs bg-white p-2 rounded block overflow-x-auto">
                  {connectedAddress}
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Faucet Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Get Test TON</h3>
              <p className="text-sm text-gray-600">Add fake TON to test the app</p>
            </div>
            <button
              onClick={handleAddTestTON}
              className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
          {user && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Your Balance:</span>
                <span className="text-2xl font-bold text-[#0088cc]">
                  {user.balance.toFixed(2)} TON
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <button
          onClick={() => navigate('/marketplace')}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all"
        >
          Continue to Marketplace
        </button>
      </div>
    </div>
  );
};

export default WalletConnect;