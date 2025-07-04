import { useRouter } from 'expo-router';
import { usePathname } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { ActivityIndicator, View } from 'react-native';
import { User, onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { db } from '../lib/firebase-config';
import { auth } from '../lib/firebase-config';
import { login, logout, register, createUserDoc } from '../lib/firebase-service';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface AuthContextType {
  userDoc: any; // <--- Add this to expose user Firestore doc
  user: User | null;
  isLoading: boolean;
  signOut: () => void;
  signIn: (email: string, password: string) => Promise<User | undefined>;
  signUp: (email: string, password: string, name?: string) => Promise<User | undefined>;
}

// ============================================================================
// Context Creation
// ============================================================================

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// ============================================================================
// Hook
// ============================================================================

export function useSession(): AuthContextType {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }
  return value;
}

// ============================================================================
// Provider Component
// ============================================================================

export function SessionProvider(props: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userDoc, setUserDoc] = useState<any>(null);
  const [userDocLoading, setUserDocLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  // Listen for Firebase Auth user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Firestore user doc on login
  useEffect(() => {
    if (!user) {
      setUserDoc(null);
      setUserDocLoading(false);
      return;
    }
    setUserDocLoading(true);
    const ref = doc(db, 'users', user.uid);
    getDoc(ref).then(snap => {
      setUserDoc(snap.exists() ? snap.data() : null);
      setUserDocLoading(false);
    });
  }, [user]);

  // Redirect if userDoc is loaded, user is logged in, but no homeId
  useEffect(() => {
    console.log('Auth effect', { pathname, user, userDoc, userDocLoading });
    if (!user || userDocLoading) return;
    if (!userDoc?.homeId && pathname !== '/HomeSelection') {
      router.replace('/HomeSelection');
    }

    // If user IS on HomeSelection but now has a homeId, redirect to main app!
    if (user && userDoc?.homeId && pathname === '/HomeSelection') {
      router.replace('/'); // or wherever your app's main page is
    }
  }, [user, userDoc, userDocLoading]);

  // Handlers
  const handleSignIn = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      return response?.user;
    } catch (error) {
      console.error('[handleSignIn error] ==>', error);
      return undefined;
    }
  };

  const handleSignUp = async (email: string, password: string, name?: string) => {
    try {
      const response = await register(email, password, name);
      if (response?.user) {
        await createUserDoc({
          displayName: name,
          email: response.user.email ?? '',
          uid: response.user.uid,
        });
      }
      return response?.user;
    } catch (err) {
      // error handling...
      return undefined;
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setUserDoc(null);
    } catch (error) {
      console.error('[handleSignOut error] ==>', error);
    }
  };

  // ============================================================================

  return (
    <AuthContext.Provider
      value={{
        isLoading: isLoading || userDocLoading,
        signIn: handleSignIn,
        signOut: handleSignOut,
        signUp: handleSignUp,
        user,
        userDoc,
      }}
    >
      {isLoading || userDocLoading ? (
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#0a7ea4" />
        </View>
      ) : (
        props.children
      )}
    </AuthContext.Provider>
  );
}
