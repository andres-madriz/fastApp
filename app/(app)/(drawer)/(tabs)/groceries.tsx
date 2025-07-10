import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { useSession } from '../../../../contexts'; // adjust import if needed
import { db } from '../../../../lib/firebase-config';
import AppLayout from '../../../../components/UI/AppLayout'; // Usa tu layout base
import GroceriesChecklist from '../../../../components/GroceriesChecklist';

type GroceryItem = { id: string; name: string; checked: boolean };

export default function GroceriesPage() {
  const { userDoc } = useSession();
  const homeId = userDoc?.homeId;
  const [groceries, setGroceries] = useState<GroceryItem[]>([]);

  // Load groceries list from Firestore
  useEffect(() => {
    if (!homeId) return;
    const fetchGroceries = async () => {
      const homeRef = doc(db, 'homes', homeId);
      const snap = await getDoc(homeRef);
      if (snap.exists()) setGroceries(snap.data().groceries || []);
    };
    fetchGroceries();
  }, [homeId]);

  // Helper to update in Firestore and state
  const updateGroceries = (newList: GroceryItem[]) => {
    setGroceries(newList);
    if (homeId) {
      updateDoc(doc(db, 'homes', homeId), { groceries: newList });
    }
  };

  const handleAdd = (name: string) => {
    const newList = [...groceries, { checked: false, id: Date.now().toString(), name }];
    updateGroceries(newList);
  };

  const handleToggle = (id: string) => {
    const newList = groceries.map(item => (item.id === id ? { ...item, checked: !item.checked } : item));
    updateGroceries(newList);
  };

  const handleDelete = (id: string) => {
    const newList = groceries.filter(item => item.id !== id);
    updateGroceries(newList);
  };

  return (
    <AppLayout>
      <GroceriesChecklist items={groceries} onAdd={handleAdd} onToggle={handleToggle} onDelete={handleDelete} />
    </AppLayout>
  );
}
