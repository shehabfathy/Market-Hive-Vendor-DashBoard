import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useState, useEffect } from 'react';

export const useFetchOrder = (orderId) => {
  const [order, setOrder] = useState();
  const [isOrderLoading, setIsOrderLoading] = useState(true);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    const orderDoc = doc(db, 'Orders', orderId);
    onSnapshot(
      orderDoc,
      (orderSnapshot) => {
        const data = { ...orderSnapshot.data(), id: orderSnapshot.id };
        setOrder(data);
        setIsOrderLoading(false);
      },
      (error) => {
        setOrderError(error.message);
      }
    );
  }, [orderId]);
  return { order, isOrderLoading, orderError };
};
