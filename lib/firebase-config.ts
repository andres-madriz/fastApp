/**
 * Firebase configuration and initialization module.
 * This module handles the setup of Firebase services for the application.
 * @module
 */
import { initializeApp } from 'firebase/app';
// IGNORE IMPORT ERROR, this is a valid import, still investigating
//@ts-ignore
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Firebase configuration object containing necessary credentials and endpoints
 * @type {Object}
 */
const firebaseConfig = {
  apiKey: 'AIzaSyCrhbCFHVV99CWAZqL-TzZl_9AwD0EL03w',
  appId: '1:89556976728:web:4eaf8611730241906a362d',
  authDomain: 'tfg-app-6b586.firebaseapp.com',
  messagingSenderId: '89556976728',
  projectId: 'tfg-app-6b586',
  storageBucket: 'tfg-app-6b586.firebasestorage.app',
};
// ============================================================================
// Firebase Initialization
// ============================================================================

/**
 * Initialize Firebase application instance
 * @type {FirebaseApp}
 */
const app = initializeApp(firebaseConfig);

/**
 * Initialize Firebase Authentication service
 * @type {Auth}
 */
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
export default app;
