import { useState, useEffect } from 'react';
import { getDoc, doc, query, where, collection, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

export const useFetchProduct = (productId) => {
  const [product, setProduct] = useState({});
  const [store, setStore] = useState({});
  const [category, setCategory] = useState({});
  const [productReviews, setProductReviews] = useState([]);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await getDoc(doc(db, 'Products', productId));
        const fetchedStore = await getDoc(doc(db, 'Stores', fetchedProduct.data().storeId));
        const fetchedCategory = await getDoc(doc(db, 'Categories', fetchedProduct.data().categoryId));
        setProduct({ ...fetchedProduct.data(), id: fetchedProduct.id });
        setStore({ ...fetchedStore.data(), id: fetchedStore.id });
        setCategory({ ...fetchedCategory.data(), id: fetchedCategory.id });
        setIsProductLoading(false);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const reviewsQuery = query(collection(db, 'Reviews'), where('productId', '==', productId), orderBy('reviewDate', 'desc'));
    const unsubscribe = onSnapshot(
      reviewsQuery,
      (reviewsSnapshot) => {
        const fetchedReviews = [];
        reviewsSnapshot.docs.forEach((review) => {
          fetchedReviews.push({ ...review.data(), id: review.id });
        });
        setProductReviews(fetchedReviews);
      },
      (error) => {
        setError(error.message);
      }
    );
    return () => unsubscribe;
  }, [productId]);

  return { product, store, category, productReviews, isProductLoading, error };
};
