import { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

export const useFetchCategory = (categoryId) => {
  const [category, setCategory] = useState({});
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState('');
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const categoryData = await getDoc(doc(db, 'Categories', categoryId));
        setCategory({ ...categoryData.data(), id: categoryData.id });
        setIsCategoryLoading(false);
      } catch (error) {
        setCategoryError(error.message);
      }
    };
    fetchStore();
  }, [categoryId]);
  return { category, isCategoryLoading, categoryError };
};
