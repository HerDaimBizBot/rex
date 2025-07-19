export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  theme: 'light' | 'dark';
  createdAt: string;
  isAdmin?: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
  color: string;
  userId: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface MedicineTaken {
  id: string;
  medicineId: string;
  userId: string;
  takenAt: string;
  scheduledTime: string;
  status: 'taken' | 'missed' | 'pending';
}

export interface Advertisement {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  targetUrl?: string;
  isActive: boolean;
  position: 'header' | 'sidebar' | 'footer';
  createdAt: string;
}