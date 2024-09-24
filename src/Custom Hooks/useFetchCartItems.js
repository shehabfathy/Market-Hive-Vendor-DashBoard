import { onSnapshot, query, collection, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useState, useEffect } from 'react';

export const useFetchCartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const user = auth.currentUser;
  useEffect(() => {
    if (user) {
      const customerId = user.uid;
      const shoppingCartQuery = query(collection(db, 'ShoppingCart'), where('customerId', '==', customerId));
      onSnapshot(shoppingCartQuery, (cartSnapshot) => {
        const cartData = cartSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setCartItems(cartData);
        setIsCartLoading(false);
      });
    }
  }, [user]);
  return { cartItems, isCartLoading };
};
