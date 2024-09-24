import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

export const useAddToCart = (product, quantity, productPrice) => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const customerId = user?.uid;
  const prodId = product.id;
  const cartData = {
    prodId,
    customerId,
    quantity,
    subTotal: productPrice * quantity
  };

  function addProductToCart() {
    addDoc(collection(db, 'ShoppingCart'), cartData);
  }

  async function isProductInShoppingCart() {
    const q = query(collection(db, 'ShoppingCart'), where('prodId', '==', prodId), where('customerId', '==', customerId));
    const response = await getDocs(q);
    const shoppingCartDoc = response.docs.map((doc) => ({ ...doc.data() }))[0];
    return shoppingCartDoc?.prodId === prodId;
  }

  async function handleCart() {
    if (user) {
      if (await isProductInShoppingCart()) {
        toast.success('product is already in cart');
      } else {
        toast.success('product is added to cart');
        addProductToCart();
      }
    } else {
      navigate('/login');
    }
  }
  return { handleCart, isProductInShoppingCart, addProductToCart };
};
