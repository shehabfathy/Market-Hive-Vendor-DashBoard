import useFetchData from './useFetchData';

export const useProductSearch = (searchTerm) => {
  const { products, categories, stores } = useFetchData();

  const filteredProducts = products.filter(
    (product) => searchTerm.length > 0 && product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const matchingCategories = categories.filter(
    (category) => searchTerm.length > 0 && category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const matchingCategoryIds = matchingCategories.map((category) => category.id);
  const filteredProductsByCategory = products.filter((product) => matchingCategoryIds.includes(product.categoryId));

  const matchingStores = stores.filter((store) => searchTerm.length > 0 && store.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const matchingStoreIds = matchingStores.map((store) => store.id);
  const filteredProductsByStore = products.filter((product) => matchingStoreIds.includes(product.storeId));

  const searchProducts = [...filteredProductsByCategory, ...filteredProductsByStore, ...filteredProducts].filter(
    (prod, index, array) => array.map((product) => product.id).indexOf(prod.id) === index
  );

  const getStoreNameFromId = (storeId) => {
    return stores.find((store) => store.id === storeId).name;
  };
  return { searchProducts, getStoreNameFromId };
};
