import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, MessageSquare, Trash2, Plus, Edit, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import { Advertisement } from '../types';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'ads'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [showAdForm, setShowAdForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | undefined>();

  useEffect(() => {
    loadUsers();
    loadAdvertisements();
  }, []);

  const loadUsers = () => {
    const storedUsers = localStorage.getItem('medireminder_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  };

  const loadAdvertisements = () => {
    const storedAds = localStorage.getItem('medireminder_advertisements');
    if (storedAds) {
      setAdvertisements(JSON.parse(storedAds));
    }
  };

  const deleteUser = (userId: string) => {
    if (userId === user?.id) {
      toast.error('Cannot delete your own account');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('medireminder_users', JSON.stringify(updatedUsers));
      
      // Also clean up user data
      const medicines = JSON.parse(localStorage.getItem('medireminder_medicines') || '[]');
      const notifications = JSON.parse(localStorage.getItem('medireminder_notifications') || '[]');
      const taken = JSON.parse(localStorage.getItem('medireminder_taken') || '[]');
      
      localStorage.setItem('medireminder_medicines', JSON.stringify(medicines.filter((m: any) => m.userId !== userId)));
      localStorage.setItem('medireminder_notifications', JSON.stringify(notifications.filter((n: any) => n.userId !== userId)));
      localStorage.setItem('medireminder_taken', JSON.stringify(taken.filter((t: any) => t.userId !== userId)));
      
      toast.success('User deleted successfully');
    }
  };

  const handleAdSubmit = (adData: Omit<Advertisement, 'id' | 'createdAt'>) => {
    if (editingAd) {
      const updatedAds = advertisements.map(ad => 
        ad.id === editingAd.id 
          ? { ...ad, ...adData }
          : ad
      );
      setAdvertisements(updatedAds);
      localStorage.setItem('medireminder_advertisements', JSON.stringify(updatedAds));
      toast.success('Advertisement updated successfully');
    } else {
      const newAd: Advertisement = {
        ...adData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      const updatedAds = [...advertisements, newAd];
      setAdvertisements(updatedAds);
      localStorage.setItem('medireminder_advertisements', JSON.stringify(updatedAds));
      toast.success('Advertisement created successfully');
    }
    
    setShowAdForm(false);
    setEditingAd(undefined);
  };

  const deleteAd = (adId: string) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      const updatedAds = advertisements.filter(ad => ad.id !== adId);
      setAdvertisements(updatedAds);
      localStorage.setItem('medireminder_advertisements', JSON.stringify(updatedAds));
      toast.success('Advertisement deleted successfully');
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage users and advertisements</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Users ({users.length})</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('ads')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ads'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Advertisements ({advertisements.length})</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'users' ? (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">User Management</h2>
                  <p className="text-gray-600">View and manage registered users</p>
                </div>

                {users.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-medium">{u.username[0].toUpperCase()}</span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{u.username}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {u.email || 'Not set'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                u.isAdmin 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {u.isAdmin ? 'Admin' : 'User'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => deleteUser(u.id)}
                                disabled={u.id === user?.id}
                                className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Advertisement Management</h2>
                    <p className="text-gray-600">Create and manage advertisements</p>
                  </div>
                  <button
                    onClick={() => setShowAdForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Advertisement</span>
                  </button>
                </div>

                {advertisements.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No advertisements</h3>
                    <p className="text-gray-600">Create your first advertisement to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {advertisements.map((ad) => (
                      <div key={ad.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{ad.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{ad.content}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingAd(ad);
                                setShowAdForm(true);
                              }}
                              className="text-gray-600 hover:text-blue-600"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteAd(ad.id)}
                              className="text-gray-600 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Position:</span>
                            <span className="font-medium capitalize">{ad.position}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Status:</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              ad.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {ad.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Ad Form Modal */}
        {showAdForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingAd ? 'Edit Advertisement' : 'Create Advertisement'}
                </h2>
              </div>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAdSubmit({
                    title: formData.get('title') as string,
                    content: formData.get('content') as string,
                    imageUrl: formData.get('imageUrl') as string,
                    targetUrl: formData.get('targetUrl') as string,
                    position: formData.get('position') as 'header' | 'sidebar' | 'footer',
                    isActive: formData.get('isActive') === 'on'
                  });
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingAd?.title}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    name="content"
                    defaultValue={editingAd?.content}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <select
                    name="position"
                    defaultValue={editingAd?.position}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="header">Header</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="footer">Footer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    defaultValue={editingAd?.imageUrl}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target URL (optional)
                  </label>
                  <input
                    type="url"
                    name="targetUrl"
                    defaultValue={editingAd?.targetUrl}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    defaultChecked={editingAd?.isActive ?? true}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdForm(false);
                      setEditingAd(undefined);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingAd ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;