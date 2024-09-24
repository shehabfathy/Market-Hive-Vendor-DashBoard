import { auth, db } from '../../firebase';
import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { useCustomerSnapshot } from './useFetchCustomer';
import toast, { useToasterStore } from 'react-hot-toast';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useFetchWishList = (productId) => {
  const navigate = useNavigate();
  const notify = (text, icon = '') => {
    if (icon == '') {
      toast.success(text);
    } else {
      toast(text, { icon: icon });
    }
  };
  const TOAST_LIMIT = 3;
  const { toasts } = useToasterStore();
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  const customerId = auth.currentUser?.uid;
  const { customer, isLoading } = useCustomerSnapshot(customerId);
  const wishlistHandler = () => {
    if (auth.currentUser !== null) {
      if (isAddedToWishlist()) {
        updateDoc(doc(db, 'Customers', customerId), {
          wishlist: arrayRemove(productId)
        });
        notify('item removed from wishlist', '🗑');
      } else {
        updateDoc(doc(db, 'Customers', customerId), {
          wishlist: arrayUnion(productId)
        });
        notify('Item added to wishlist');
      }
    } else {
      navigate('/login');
    }
  };

  const isAddedToWishlist = () => {
    if (auth.currentUser !== null) {
      if (customer.wishlist?.includes(productId)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  return { isAddedToWishlist, wishlistHandler, isLoading };
};
