import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, DollarSign, ShoppingBag, AlertTriangle, 
  Shield, CheckCircle, XCircle, MoreVertical,
  TrendingUp, Flag, Wallet, Star // Changed from Package to Star
} from 'lucide-react';
import { mockDB } from '../../services/mockDatabase';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'withdrawals' | 'verifications'>('overview');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserActions, setShowUserActions] = useState(false);
  
  // Check admin authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin-authenticated');
    if (!isAuthenticated) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const stats = mockDB.getStats();
  const users = Array.from(
    (mockDB as any).data?.users?.values() || []
  );
  const products = mockDB.getProducts();
  const reports = Array.from(
    (mockDB as any).data?.reports?.values() || []
  );
  const withdrawals = Array.from(
    (mockDB as any).data?.withdrawals?.values() || []
  );

  const handleLogout = () => {
    localStorage.removeItem('admin-authenticated');
    navigate('/');
  };

  const handleUserAction = (action: 'ban' | 'verify' | 'unverify', userId: string) => {
    const user = users.find((u: any) => u.id === userId);
    if (!user) return;

    switch (action) {
      case 'ban':
        if (window.confirm(`Ban user ${user.username}? This will deactivate their products.`)) {
          mockDB.banUser(userId);
          alert('User banned successfully');
        }
        break;
      case 'verify':
        mockDB.updateUser(userId, { verificationStatus: 'VERIFIED' });
        alert('User verified successfully');
        break;
      case 'unverify':
        mockDB.updateUser(userId, { verificationStatus: 'REJECTED' });
        alert('User verification removed');
        break;
    }
    setShowUserActions(false);
  };

  const handleReportAction = (reportId: string, action: 'resolve' | 'ban') => {
    const report = reports.find((r: any) => r.id === reportId);
    if (!report) return;

    if (action === 'resolve') {
      // Mark report as resolved
      alert(`Report ${reportId} marked as resolved`);
    } else if (action === 'ban') {
      if (window.confirm('Ban the seller associated with this report?')) {
        const product = products.find(p => p.id === report.productId);
        if (product) {
          mockDB.banUser(product.sellerId);
          alert('Seller banned and products deactivated');
        }
      }
    }
  };

  const handleWithdrawalAction = (withdrawalId: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      mockDB.approveWithdrawal(withdrawalId);
      alert('Withdrawal approved');
    } else {
      // For mock, we'll just remove it
      alert('Withdrawal rejected');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6" />
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-gray-300">TON Marketplace Administration</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalVolume.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Total Volume (TON)</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <ShoppingBag className="w-5 h-5 text-purple-500" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalSales}</div>
            <div className="text-sm text-gray-600">Total Sales</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingReports}</div>
            <div className="text-sm text-gray-600">Pending Reports</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 overflow-x-auto mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'reports', label: 'Reports', icon: Flag },
            { id: 'withdrawals', label: 'Withdrawals', icon: Wallet },
            { id: 'verifications', label: 'Verifications', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#0088cc] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Overview</h2>
              
              <div className="space-y-6">
                {/* Recent Activity */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">New user registered</div>
                            <div className="text-sm text-gray-600">2 hours ago</div>
                          </div>
                        </div>
                        <div className="text-green-600 font-medium">+1</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Health */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Platform Health</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="text-green-600 font-bold text-2xl mb-2">98%</div>
                      <div className="text-green-800 font-medium">Uptime</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="text-blue-600 font-bold text-2xl mb-2">0</div>
                      <div className="text-blue-800 font-medium">Active Issues</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">User Management</h2>
              
              <div className="space-y-4">
                {users.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold">{user.username}</div>
                        <div className="text-sm text-gray-600 flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'SELLER' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                          {user.verificationStatus === 'VERIFIED' && (
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs">
                              Verified
                            </span>
                          )}
                          {user.isBanned && (
                            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                              Banned
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserActions(!showUserActions);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {showUserActions && selectedUser?.id === user.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                          <button
                            onClick={() => handleUserAction(user.isBanned ? 'unverify' : 'ban', user.id)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 text-red-600"
                          >
                            {user.isBanned ? 'Unban User' : 'Ban User'}
                          </button>
                          {user.role === 'SELLER' && (
                            <button
                              onClick={() => handleUserAction(
                                user.verificationStatus === 'VERIFIED' ? 'unverify' : 'verify',
                                user.id
                              )}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 text-blue-600"
                            >
                              {user.verificationStatus === 'VERIFIED' ? 'Remove Verification' : 'Verify Seller'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Report Management</h2>
              
              <div className="space-y-4">
                {reports.length === 0 ? (
                  <div className="text-center py-12">
                    <Flag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports</h3>
                    <p className="text-gray-600">No pending reports to review</p>
                  </div>
                ) : (
                  reports.map((report: any) => (
                    <div key={report.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold text-gray-900">Report #{report.id.slice(0, 8)}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === 'PENDING' 
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-sm text-gray-700 mb-2">
                          <strong>Reason:</strong> {report.reason}
                        </div>
                        <p className="text-gray-600">{report.description}</p>
                      </div>
                      
                      {report.status === 'PENDING' && (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleReportAction(report.id, 'resolve')}
                            className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                          >
                            <CheckCircle className="w-4 h-4 inline mr-2" />
                            Mark Resolved
                          </button>
                          <button
                            onClick={() => handleReportAction(report.id, 'ban')}
                            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                          >
                            <XCircle className="w-4 h-4 inline mr-2" />
                            Ban Seller
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Withdrawals Tab */}
          {activeTab === 'withdrawals' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Withdrawal Requests</h2>
              
              <div className="space-y-4">
                {withdrawals.length === 0 ? (
                  <div className="text-center py-12">
                    <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Withdrawals</h3>
                    <p className="text-gray-600">No pending withdrawal requests</p>
                  </div>
                ) : (
                  withdrawals.map((withdrawal: any) => {
                    const user = users.find((u: any) => u.id === withdrawal.sellerId);
                    return (
                      <div key={withdrawal.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {user?.username || 'Unknown Seller'}
                            </div>
                            <div className="text-sm text-gray-600">
                              Requested {new Date(withdrawal.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[#0088cc]">
                              {withdrawal.amount} TON
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              withdrawal.status === 'PENDING' 
                                ? 'bg-amber-100 text-amber-800'
                                : withdrawal.status === 'APPROVED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {withdrawal.status}
                            </span>
                          </div>
                        </div>
                        
                        {withdrawal.status === 'PENDING' && (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleWithdrawalAction(withdrawal.id, 'approve')}
                              className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                            >
                              <CheckCircle className="w-4 h-4 inline mr-2" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleWithdrawalAction(withdrawal.id, 'reject')}
                              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                            >
                              <XCircle className="w-4 h-4 inline mr-2" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Verifications Tab */}
          {activeTab === 'verifications' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Seller Verification Requests</h2>
              
              <div className="space-y-4">
                {users.filter((u: any) => u.role === 'SELLER' && u.verificationStatus === 'PENDING').length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
                    <p className="text-gray-600">No verification requests to review</p>
                  </div>
                ) : (
                  users
                    .filter((u: any) => u.role === 'SELLER' && u.verificationStatus === 'PENDING')
                    .map((user: any) => {
                      const userProducts = products.filter(p => p.sellerId === user.id);
                      const totalSales = userProducts.reduce((sum, p) => sum + p.totalSales, 0);
                      
                      return (
                      <div key={user.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold">{user.username}</div>
                              <div className="text-sm text-gray-600">
                                Joined {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#0088cc]">
                              {user.balance.toFixed(2)} TON
                            </div>
                            <div className="text-sm text-gray-600">Balance</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <div className="text-sm text-gray-600">Products</div>
                            <div className="font-bold">
                              {userProducts.length}
                            </div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3">
                            <div className="text-sm text-gray-600">Sales</div>
                            <div className="font-bold">
                              {totalSales}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleUserAction('verify', user.id)}
                            className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                          >
                            <CheckCircle className="w-4 h-4 inline mr-2" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleUserAction('unverify', user.id)}
                            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                          >
                            <XCircle className="w-4 h-4 inline mr-2" />
                            Reject
                          </button>
                        </div>
                      </div>
                    )})
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
