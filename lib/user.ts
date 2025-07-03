import { doc, setDoc } from 'firebase/firestore';

import { db } from '../lib/firebase-config';

export async function setUserHome(userId: string, homeId: string) {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, { homeId }, { merge: true });
}
