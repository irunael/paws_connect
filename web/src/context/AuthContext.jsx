import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.model?.collectionName === 'users') {
      setCurrentUser(pb.authStore.model);
    }
    setInitialLoading(false);
  }, []);

  const login = async (email, password) => {
    const authData = await pb.collection('users').authWithPassword(email, password);
    setCurrentUser(authData.record);
    return authData;
  };

  const signupNgo = async (email, password, ngoName, contactPhone, address) => {
    const record = await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      userType: 'ngo',
      ngoName,
      contactPhone: contactPhone || '',
      address: address || ''
    });
    
    const authData = await pb.collection('users').authWithPassword(email, password);
    setCurrentUser(authData.record);
    return authData;
  };

  const signupAdopter = async (email, password) => {
    console.log('Creating adopter with data:', { email, userType: 'adopter' });
    
    const record = await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      userType: 'adopter'
    });
    
    console.log('Created user record:', record);
    console.log('User userType:', record.userType);
    
    const authData = await pb.collection('users').authWithPassword(email, password);
    setCurrentUser(authData.record);
    return authData;
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
  };

  const isAuthenticated = pb.authStore.isValid && pb.authStore.model?.collectionName === 'users';
  // Se tem userType definido, usa ele. Se não, verifica se tem ngoName (ONGs antigas)
  const isNgo = currentUser?.userType === 'ngo' || (currentUser?.ngoName && !currentUser?.userType);
  const isAdopter = currentUser?.userType === 'adopter' || (!currentUser?.userType && !currentUser?.ngoName);

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      currentNgo: currentUser, // mantém compatibilidade
      login, 
      signupNgo, 
      signupAdopter,
      logout, 
      isAuthenticated, 
      isNgo,
      isAdopter,
      initialLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
