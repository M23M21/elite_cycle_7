'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/utils/firebaseConfig';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getUserData(user.uid);
        if (userDoc) {
          setUser({ ...user, ...userDoc });
          setBalance(userDoc.balance || 0);
        } else {
          setUser(user);
        }
      } else {
        setUser(null);
        setBalance(0);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getUserData(auth.currentUser.uid);
    if (userDoc) {
      setBalance(userDoc.balance || 0);
    }
  };

  const signup = async (email, password, name, address) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const role = await determineUserRole();
    await saveUserToFirestore(user, name, address, role);

    const userDoc = await getUserData(user.uid);
    if (userDoc) {
      setUser({ ...user, ...userDoc });
      setBalance(userDoc.balance || 100000);
    } else {
      setUser(user);
      setBalance(100000);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setBalance(0);
  };

  const determineUserRole = async () => {
    const adminQuery = query(collection(db, "users"), where("role", "==", "admin"));
    const adminSnapshot = await getDocs(adminQuery);
    return adminSnapshot.empty ? "admin" : "user";
  };

  const saveUserToFirestore = async (user, name, address, role) => {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: name,
      address: address,
      role: role,
      balance: 100000,
    }, { merge: true });
  };

  const getUserData = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : null;
  };

  return (
    <AuthContext.Provider value={{ user, balance, login, signup, logout, setBalance }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}