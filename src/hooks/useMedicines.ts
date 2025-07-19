import { useState, useEffect } from 'react';
import { Medicine, MedicineTaken } from '../types';
import { useAuth } from '../context/AuthContext';

export const useMedicines = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medicineTaken, setMedicineTaken] = useState<MedicineTaken[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadMedicines();
      loadMedicineTaken();
    }
  }, [user]);

  const loadMedicines = () => {
    const stored = localStorage.getItem('medireminder_medicines');
    if (stored) {
      const allMedicines = JSON.parse(stored);
      const userMedicines = allMedicines.filter((m: Medicine) => m.userId === user?.id);
      setMedicines(userMedicines);
    }
  };

  const loadMedicineTaken = () => {
    const stored = localStorage.getItem('medireminder_taken');
    if (stored) {
      const allTaken = JSON.parse(stored);
      const userTaken = allTaken.filter((t: MedicineTaken) => t.userId === user?.id);
      setMedicineTaken(userTaken);
    }
  };

  const addMedicine = async (medicine: Omit<Medicine, 'id' | 'userId'>) => {
    if (!user) return;
    
    setLoading(true);
    const newMedicine: Medicine = {
      ...medicine,
      id: Date.now().toString(),
      userId: user.id
    };

    const stored = localStorage.getItem('medireminder_medicines');
    const allMedicines = stored ? JSON.parse(stored) : [];
    allMedicines.push(newMedicine);
    localStorage.setItem('medireminder_medicines', JSON.stringify(allMedicines));
    
    setMedicines(prev => [...prev, newMedicine]);
    setLoading(false);
  };

  const updateMedicine = async (id: string, updates: Partial<Medicine>) => {
    setLoading(true);
    const stored = localStorage.getItem('medireminder_medicines');
    const allMedicines = stored ? JSON.parse(stored) : [];
    
    const index = allMedicines.findIndex((m: Medicine) => m.id === id);
    if (index !== -1) {
      allMedicines[index] = { ...allMedicines[index], ...updates };
      localStorage.setItem('medireminder_medicines', JSON.stringify(allMedicines));
      setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    }
    setLoading(false);
  };

  const deleteMedicine = async (id: string) => {
    setLoading(true);
    const stored = localStorage.getItem('medireminder_medicines');
    const allMedicines = stored ? JSON.parse(stored) : [];
    
    const filtered = allMedicines.filter((m: Medicine) => m.id !== id);
    localStorage.setItem('medireminder_medicines', JSON.stringify(filtered));
    setMedicines(prev => prev.filter(m => m.id !== id));
    setLoading(false);
  };

  const markMedicineTaken = async (medicineId: string, scheduledTime: string, status: 'taken' | 'missed') => {
    if (!user) return;

    const taken: MedicineTaken = {
      id: Date.now().toString(),
      medicineId,
      userId: user.id,
      takenAt: new Date().toISOString(),
      scheduledTime,
      status
    };

    const stored = localStorage.getItem('medireminder_taken');
    const allTaken = stored ? JSON.parse(stored) : [];
    allTaken.push(taken);
    localStorage.setItem('medireminder_taken', JSON.stringify(allTaken));
    
    setMedicineTaken(prev => [...prev, taken]);
  };

  const getTodaysMedicines = () => {
    const today = new Date().toISOString().split('T')[0];
    return medicines.filter(medicine => {
      if (!medicine.isActive) return false;
      const startDate = new Date(medicine.startDate).toISOString().split('T')[0];
      const endDate = medicine.endDate ? new Date(medicine.endDate).toISOString().split('T')[0] : null;
      
      return startDate <= today && (!endDate || endDate >= today);
    });
  };

  const getMedicineStatus = (medicineId: string, time: string) => {
    const today = new Date().toISOString().split('T')[0];
    const taken = medicineTaken.find(t => 
      t.medicineId === medicineId && 
      t.scheduledTime === time &&
      t.takenAt.startsWith(today)
    );
    return taken?.status || 'pending';
  };

  return {
    medicines,
    loading,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    markMedicineTaken,
    getTodaysMedicines,
    getMedicineStatus
  };
};