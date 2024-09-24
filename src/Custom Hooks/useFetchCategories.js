import { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';

export const useFetchCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Categories'));
        const fetchedCategories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setIsCategoriesLoading(false);
        setCategories(fetchedCategories);
      } catch (error) {
        setCategoriesError(error.message);
      }
    };

    fetchCategories();
  }, []);
  return { categories, isCategoriesLoading, categoriesError };
};
