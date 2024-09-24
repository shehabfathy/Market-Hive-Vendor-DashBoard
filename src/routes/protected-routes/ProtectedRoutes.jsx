import { Navigate } from 'react-router-dom';
import { auth } from '../../../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, () => {
      setIsAuthLoading(false);
    });
  }, []);

  return isAuthLoading ? (
    <div className="h-full absolute left-1/2 flex flex-col justify-center">
      <CircularProgress />
    </div>
  ) : auth.currentUser !== null ? (
    children
  ) : (
    <Navigate to="/login" />
  );
}
