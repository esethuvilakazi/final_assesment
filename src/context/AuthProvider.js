import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [onboarded, setOnboarded] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      if (usr) {
        setUser(usr);
        try {
          const userDoc = await getDoc(doc(db, 'users', usr.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setOnboarded(!!data.onboarded);
          } else {
            setOnboarded(false);
          }
        } catch {
          setOnboarded(true);
        }
      } else {
        setUser(null);
        setOnboarded(true);
      }
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    await fbSignOut(auth);
    await AsyncStorage.removeItem('hasOnboarded');
  };

  return (
    <AuthContext.Provider value={{ user, initializing, signOut, onboarded, setOnboarded }}>
      {children}
    </AuthContext.Provider>
  );
};