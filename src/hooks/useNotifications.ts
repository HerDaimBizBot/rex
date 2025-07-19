import { useState, useEffect } from 'react';
import { Notification } from '../types';
import { useAuth } from '../context/AuthContext';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = () => {
    const stored = localStorage.getItem('medireminder_notifications');
    if (stored) {
      const allNotifications = JSON.parse(stored);
      const userNotifications = allNotifications.filter((n: Notification) => n.userId === user?.id);
      setNotifications(userNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date().toISOString()
    };

    const stored = localStorage.getItem('medireminder_notifications');
    const allNotifications = stored ? JSON.parse(stored) : [];
    allNotifications.push(newNotification);
    localStorage.setItem('medireminder_notifications', JSON.stringify(allNotifications));
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = async (id: string) => {
    setLoading(true);
    const stored = localStorage.getItem('medireminder_notifications');
    const allNotifications = stored ? JSON.parse(stored) : [];
    
    const index = allNotifications.findIndex((n: Notification) => n.id === id);
    if (index !== -1) {
      allNotifications[index].isRead = true;
      localStorage.setItem('medireminder_notifications', JSON.stringify(allNotifications));
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }
    setLoading(false);
  };

  const markAllAsRead = async () => {
    setLoading(true);
    const stored = localStorage.getItem('medireminder_notifications');
    const allNotifications = stored ? JSON.parse(stored) : [];
    
    allNotifications.forEach((n: Notification) => {
      if (n.userId === user?.id) {
        n.isRead = true;
      }
    });
    
    localStorage.setItem('medireminder_notifications', JSON.stringify(allNotifications));
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setLoading(false);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    unreadCount
  };
};