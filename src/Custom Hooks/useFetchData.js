import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';

const useFetchData = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [isProdsLoading, setProdsLoading] = useState(true);
  const [isCatsLoading, setCatsLoading] = useState(true);
  const [isStoresLoading, setIsStoresLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Products'));
        const fetchedProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setProdsLoading(false);
        setProducts(fetchedProducts);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Categories'));
        const fetchedCategories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setCatsLoading(false);
        setCategories(fetchedCategories);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchStores = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Stores'));
        const fetchedStores = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setIsStoresLoading(false);
        setStores(fetchedStores);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchProducts();
    fetchCategories();
    fetchStores();
  }, []);
  return {
    products,
    categories,
    stores,
    isProdsLoading,
    isCatsLoading,
    isStoresLoading,
    error
  };
};

export default useFetchData;
