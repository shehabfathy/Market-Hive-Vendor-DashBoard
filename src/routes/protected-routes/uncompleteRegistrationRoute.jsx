import { Navigate } from 'react-router-dom';
import { auth } from '../../../firebase.js';
import { CircularProgress } from '@mui/material';
import { useFetchVendor } from 'Custom Hooks/useFetchVendor.js';

export function UnCompleteRegRoute({ children }) {
  const { vendor, isVendorLoading } = useFetchVendor(auth.currentUser.uid);
  return isVendorLoading ? (
    <div className="h-full absolute left-1/2 flex flex-col justify-center">
      <CircularProgress />
    </div>
  ) : vendor.storeId ? (
    children
  ) : (
    <Navigate to="/create-store"></Navigate>
  );
}

export function CompletedRegRoute({ children }) {
  const { vendor, isVendorLoading } = useFetchVendor(auth.currentUser.uid);
  console.log(vendor.storeId);
  return isVendorLoading ? (
    <div className="h-full absolute left-1/2 flex flex-col justify-center">
      <CircularProgress />
    </div>
  ) : vendor.storeId ? (
    <Navigate to="/"></Navigate>
  ) : (
    children
  );
}
