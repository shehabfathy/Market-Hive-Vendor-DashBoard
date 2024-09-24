import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';

export const useFetchStore = (storeId) => {
  const [store, setStore] = useState({});
  const [isStoreLoading, setIsStoreLoading] = useState(true);
  const [storeError, setStoreError] = useState(false);

  useEffect(() => {
    const fetchStore = () => {
      try {
        onSnapshot(doc(db, 'Stores', storeId), (onShot) => {
          setStore({ ...onShot.data(), id: storeId });
          setIsStoreLoading(false);
        });
      } catch (error) {
        setStoreError(error.message);
      }
    };
    fetchStore();
  }, [storeId]);
  return { store, isStoreLoading, storeError };
};
