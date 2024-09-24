import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useState, useEffect } from 'react';

export const useFetchVendor = (vendorId) => {
  const [vendor, setVendor] = useState({});
  const [isVendorLoading, setIsVendorLoading] = useState(true);
  const [vendorError, setVendorError] = useState('');

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const vendorSnapshot = await getDoc(doc(db, 'Vendors', vendorId));
        setVendor({ ...vendorSnapshot.data(), id: vendorSnapshot.id });
        setIsVendorLoading(false);
      } catch (error) {
        setIsVendorLoading(false);
        setVendorError(error.message);
      }
    };
    fetchVendor();
  }, [vendorId]);
  return { vendor, isVendorLoading, vendorError };
};
