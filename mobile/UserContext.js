import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "WastePinUserProfile";

export const UserContext = createContext({
  role: null,
  userId: null,
  name: null,
  phone: null,
  initialized: false,
  setProfile: () => {},
  clearProfile: () => {},
});

export function UserProvider({ children }) {
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const profile = JSON.parse(stored);
          setRole(profile.role);
          setUserId(profile.userId);
          setName(profile.name);
          setPhone(profile.phone);
        }
      } catch (error) {
        console.warn("Unable to load stored profile", error);
      } finally {
        setInitialized(true);
      }
    };

    loadProfile();
  }, []);

  const setProfile = async ({ role, userId, name, phone }) => {
    try {
      const profile = { role, userId, name, phone };
      setRole(role);
      setUserId(userId);
      setName(name);
      setPhone(phone);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.warn("Unable to save profile", error);
    }
  };

  const clearProfile = async () => {
    try {
      setRole(null);
      setUserId(null);
      setName(null);
      setPhone(null);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Unable to clear profile", error);
    }
  };

  return (
    <UserContext.Provider value={{ role, userId, name, phone, initialized, setProfile, clearProfile }}>
      {children}
    </UserContext.Provider>
  );
}
