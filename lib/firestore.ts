import { doc, setDoc, collection, query, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';

import { db } from '../lib/firebase-config';

// Create a new home, returns homeId
export async function createHome(userId: string, homeName: string): Promise<string> {
  const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 char random code
  const homeRef = doc(collection(db, 'homes'));
  await setDoc(homeRef, {
    groceries: [],
    joinCode,
    members: [userId],
    name: homeName,
    todos: {},
  });
  return homeRef.id;
}

// Find home by code
export async function findHomeByCode(joinCode: string): Promise<{ id: string; data: any } | null> {
  const q = query(collection(db, 'homes'), where('joinCode', '==', joinCode));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { data: docSnap.data(), id: docSnap.id };
}

// Join a home
export async function joinHome(userId: string, homeId: string) {
  const homeRef = doc(db, 'homes', homeId);
  await updateDoc(homeRef, {
    members: arrayUnion(userId),
  });
}
