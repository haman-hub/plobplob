import React, { useState } from 'react';
import { Wallet, DollarSign, Clock, CheckCircle, XCircle, ArrowUpRight, AlertCircle } from 'lucide-react';
import { mockDB } from '../../services/mockDatabase';

const SellerWallet: React.FC = () => {
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  const user = mockDB.getCurrentUser();
  const withdrawals = Array.from(
    mockDB.getCurrentUser() ? 
    Object.values(mockDB) : []
  ).filter((item: any) => item.sellerId === user?.id);

  const pendingWithdrawals = withdrawals.filter((w: any) => w.status === 'PENDING');
  const completedWithdrawals = withdrawals.filter((w: any) => w.status === 'APPROVED');
  const rejectedWithdrawals = withdrawals.filter((w: any) => w.status === 'REJECTED');

  const handleWithdrawalRequest = () => {
    if (!user) return;
    
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount > user.balance) {
      alert('Insufficient balance');
      return;
    }

    if (amount < 1) {
      alert('Minimum withdrawal amount is 1 TON');
      return;
    }

    setIsRequesting(true);
    
    const withdrawal = mockDB.requestWithdrawal(user.id, amount);
    
    setTimeout(() => {
      setIsRequesting(false);
      if (withdrawal) {
        setWithdrawalAmount('');
        alert(`Withdrawal request submitted for ${amount} TON`);
      } else {
        alert('Failed to submit withdrawal request');
      }
    }, 1500);
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock };
      case 'APPROVED':
        return { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
      case 'REJECTED':
        return { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', icon: Clock };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Seller Wallet</h1>
        <div className="flex items-center space-x-2 text-[#0088cc]">
          <Wallet className="w-5 h-5" />
          <span className="font-semibold">Seller Account</span>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-[#0088cc] to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Available Balance</h2>
            <p className="text-blue-100 text-sm">Ready for withdrawal</p>
          </div>
          <Wallet className="w-8 h-8" />
        </div>
        <div className="text-4xl font-bold mb-2">{user?.balance.toFixed(2)} TON</div>
        <div className="text-blue-200 text-sm">
          ≈ ${(user?.balance || 0 * 2.5).toFixed(2)} USD (estimate)
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Request Withdrawal</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (TON)
            </label>
            <div className="relative">
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0088cc] focus:border-transparent outline-none"
                min="1"
                max={user?.balance}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                TON
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Available: {user?.balance.toFixed(2)} TON • Min: 1 TON
            </p>
          </div>

          <button
            onClick={handleWithdrawalRequest}
            disabled={isRequesting || !withdrawalAmount || (user?.balance || 0) < 1}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRequesting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <>
                <ArrowUpRight className="w-5 h-5 inline mr-2" />
                Request Withdrawal
              </>
            )}
          </button>
        </div>
      </div>

      {/* Withdrawal History */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Withdrawal History</h3>

        {withdrawals.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Withdrawals Yet</h4>
            <p className="text-gray-600">Your withdrawal history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Pending */}
            {pendingWithdrawals.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock className="w-4 h-4 text-amber-500 mr-2" />
                  Pending ({pendingWithdrawals.length})
                </h4>
                <div className="space-y-2">
                  {pendingWithdrawals.map((withdrawal: any) => (
                    <div key={withdrawal.id} className="bg-amber-50 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">{withdrawal.amount} TON</div>
                          <div className="text-sm text-amber-700">
                            Requested {new Date(withdrawal.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-amber-600 font-medium">Pending</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed */}
            {completedWithdrawals.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Completed ({completedWithdrawals.length})
                </h4>
                <div className="space-y-2">
                  {completedWithdrawals.map((withdrawal: any) => (
                    <div key={withdrawal.id} className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">{withdrawal.amount} TON</div>
                          <div className="text-sm text-gray-600">
                            Approved {new Date(withdrawal.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-green-600 font-medium">Approved</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rejected */}
            {rejectedWithdrawals.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <XCircle className="w-4 h-4 text-red-500 mr-2" />
                  Rejected ({rejectedWithdrawals.length})
                </h4>
                <div className="space-y-2">
                  {rejectedWithdrawals.map((withdrawal: any) => (
                    <div key={withdrawal.id} className="bg-red-50 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">{withdrawal.amount} TON</div>
                          <div className="text-sm text-red-700">
                            Rejected {new Date(withdrawal.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-red-600 font-medium">Rejected</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-2xl p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Withdrawal Information</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Withdrawals are processed within 24-48 hours</li>
              <li>• Minimum withdrawal amount: 1 TON</li>
              <li>• Platform fee for withdrawals: 0.05 TON</li>
              <li>• Funds will be sent to your connected wallet address</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerWallet;