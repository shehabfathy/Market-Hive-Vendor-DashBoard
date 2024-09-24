import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';

export const useFetchProds = (productIds) => {
  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productError, setProductError] = useState('');

  useEffect(() => {
    const arrayOfProducts = [];
    const fetchProds = async () => {
      try {
        productIds.map((prod) => {
          onSnapshot(doc(db, 'Products', prod), (onShot) => {
            arrayOfProducts.push({ id: prod, ...onShot.data() });
            setProduct(arrayOfProducts);
          });
          setIsLoading(false);
        });
      } catch (error) {
        setIsLoading(false);
        setProductError(error.message);
      }
    };
    fetchProds();
  }, [productIds]);
  return { product, isLoading, productError };
};

// export const useFetchProds = (products) => {
//   const [product, setProduct] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [productError, setProductError] = useState('');

//   useEffect(() => {
//     const unsubscribeArr = [];
//     const fetchProduct = () => {
//       try {
//         const arrOfProducts = [];
//         products.map((prod, i) => {
//           const productData = onSnapshot(doc(db, 'Products', prod), (onShot) => {
//             arrOfProducts.push({
//               ...onShot.data(),
//               id: prod,
//               key: i
//             });

//             setProduct(arrOfProducts);
//             setIsLoading(false);
//           });
//           unsubscribeArr.push(productData);
//         });
//       } catch (error) {
//         setProductError(error.message);
//       }
//     };
//     fetchProduct();
//     return () => {
//       unsubscribeArr.forEach((unsubscribe) => unsubscribe());
//     };
//   }, [products]);
//   return { product, isLoading, productError };
// };
