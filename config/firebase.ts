import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCrhbCFHVV99CWAZqL-TzZl_9AwD0EL03w',
  appId: '1:89556976728:web:4eaf8611730241906a362d',
  authDomain: 'tfg-app-6b586.firebaseapp.com',
  messagingSenderId: '89556976728',
  projectId: 'tfg-app-6b586',
  storageBucket: 'tfg-app-6b586.firebasestorage.app',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
