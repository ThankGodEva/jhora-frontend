'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCircle, Trash2, Undo2, Square, CheckSquare, ChevronDown } from 'lucide-react';
import api from '@/lib/api';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'help' | 'review' | 'payment' | 'return' | 'verification';
  status: 'read' | 'unread';
  date: string;
  orderNumber?: string;
  itemImage?: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'read' | 'unread'>('all');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUndo, setShowUndo] = useState(false);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Replace with your real API endpoint
      const res = await api.get('/notifications');
      setNotifications(res.data || mockNotifications);
    } catch (err) {
      console.error('Failed to load notifications', err);
      setNotifications(mockNotifications); // fallback
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'read') return n.status === 'read';
    if (activeTab === 'unread') return n.status === 'unread';
    return true;
  });

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (selectMode) setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const markAsRead = async (ids: string[]) => {
    try {
      await api.post('/notifications/mark-read', { ids });
      setNotifications(prev =>
        prev.map(n => (ids.includes(n.id) ? { ...n, status: 'read' } : n))
      );
    } catch (err) {
      console.error('Mark read failed', err);
    }
  };

  const deleteNotifications = async (ids: string[]) => {
    try {
      await api.delete('/notifications', { data: { ids } });
      setDeletedIds(ids);
      setNotifications(prev => prev.filter(n => !ids.includes(n.id)));
      setShowUndo(true);
      setTimeout(() => setShowUndo(false), 5000);
      setSelectedIds([]);
      setSelectMode(false);
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const undoDelete = async () => {
    try {
      await api.post('/notifications/undo-delete', { ids: deletedIds });
      fetchNotifications(); // refresh
      setShowUndo(false);
      setDeletedIds([]);
    } catch (err) {
      console.error('Undo failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Notifications</h1>

        {notifications.length > 0 && (
          <div className="flex items-center gap-3">
            {selectMode ? (
              <>
                <button onClick={toggleSelectAll} className="text-orange-600 text-sm font-medium">
                  {selectedIds.length === filteredNotifications.length ? 'Deselect All' : 'Select All'}
                </button>
                <button
                  onClick={() => deleteNotifications(selectedIds)}
                  disabled={selectedIds.length === 0}
                  className="text-red-600 disabled:text-gray-400"
                >
                  <Trash2 size={20} />
                </button>
                <button onClick={toggleSelectMode} className="text-gray-600">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={toggleSelectMode} className="text-orange-600 font-medium">
                Select
              </button>
            )}
          </div>
        )}
      </header>

      {/* Tabs */}
      <div className="flex border-b bg-white sticky top-14 z-10">
        {['All', 'Read', 'Unread'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab.toLowerCase() as any);
              setSelectMode(false);
              setSelectedIds([]);
            }}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === tab.toLowerCase()
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading notifications...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Bell size={40} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Nothing to see here!</h2>
            <p className="text-gray-600">You currently have no notifications. All notifications will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm p-4 flex items-start gap-4 relative ${
                  selectMode ? 'cursor-pointer' : ''
                }`}
                onClick={() => selectMode && toggleSelect(notification.id)}
              >
                {selectMode && (
                  <div className="pt-1">
                    {selectedIds.includes(notification.id) ? (
                      <CheckSquare size={24} className="text-orange-600" />
                    ) : (
                      <Square size={24} className="text-gray-300" />
                    )}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {notification.status === 'unread' && (
                        <div className="w-2 h-2 bg-orange-600 rounded-full" />
                      )}
                      <h3 className={`font-medium ${notification.status === 'unread' ? 'text-black' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                    </div>
                    <span className="text-xs text-gray-500">{notification.date}</span>
                  </div>

                  <p className="mt-1 text-sm text-gray-600">{notification.message}</p>

                  {notification.itemImage && (
                    <img
                      src={notification.itemImage}
                      alt="Item"
                      className="mt-2 w-16 h-16 object-cover rounded-md"
                    />
                  )}

                  {notification.orderNumber && (
                    <p className="mt-1 text-xs text-orange-600">
                      Order #{notification.orderNumber}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Undo Snackbar */}
      {showUndo && (
        <div className="fixed bottom-6 left-4 right-4 bg-gray-800 text-white px-6 py-4 rounded-full shadow-lg flex items-center justify-between z-50">
          <span>Notification deleted</span>
          <button onClick={undoDelete} className="flex items-center gap-2 text-orange-400 font-medium">
            <Undo2 size={18} /> Undo
          </button>
        </div>
      )}
    </div>
  );
}

// Mock data (replace with real API later)
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Order shipped',
    message: 'Your order has been shipped and is on its way. Tracking number ready.',
    type: 'order',
    status: 'unread',
    date: 'Today, 9:41 AM',
    orderNumber: 'MG-7200',
    itemImage: 'https://via.placeholder.com/64/8B4513/FFFFFF?text=Bag',
  },
  {
    id: '2',
    title: 'Help Request Sent',
    message: 'Your help request has been sent. We’ll get back to you soon.',
    type: 'help',
    status: 'read',
    date: 'Yesterday',
  },
  // Add more mock items...
];