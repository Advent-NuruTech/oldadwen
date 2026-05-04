"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface ExtendedUser extends User {
  profilePicture?: string | null;
}

interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // 🔹 Fetch extra profile data from Firestore
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          const extraData = userDoc.exists() ? userDoc.data() : {};

          setUser({
            ...currentUser,
            profilePicture: extraData.profilePicture || currentUser.photoURL || null,
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
