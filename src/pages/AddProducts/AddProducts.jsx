import { useEffect, useState } from 'react';

import AddProductForm from './AddProductForm';
import { UploadImage } from './UploadImage';
import { useLocation } from 'react-router';

function AddProducts() {
  const [productImg, setProductImg] = useState([]);
  const [percentage, setPercentage] = useState(null);
  const [imagesUrls, setImagesUrls] = useState([]);
  const [isEditing, setIsEditing] = useState();
  const location = useLocation();
  const productInfo = location?.state;
  console.log(productInfo);

  useEffect(() => {
    if (productInfo?.isEdite === true) {
      setIsEditing(true);
      const recordimages = productInfo?.record?.images || [];
      setImagesUrls(recordimages);
    }
  }, [productInfo]);

  // UseEffect to upload images
  useEffect(() => {
    productImg && UploadImage(productImg, setImagesUrls, setPercentage);
  }, [productImg]);
  console.log(imagesUrls);
  console.log(isEditing);
  return (
    <div>
      {isEditing && (
        <AddProductForm
          productImg={productImg}
          percentage={percentage}
          setProductImg={setProductImg}
          images={imagesUrls}
          edite={isEditing}
          setEdite={setIsEditing}
          record={productInfo?.record}
          setImagesUrls={setImagesUrls}
        />
      )}
      {!isEditing && (
        <AddProductForm
          productImg={productImg}
          percentage={percentage}
          setProductImg={setProductImg}
          images={imagesUrls}
          edite={isEditing}
          setEdite={setIsEditing}
          record={productInfo?.record}
          setImagesUrls={setImagesUrls}
        />
      )}
    </div>
  );
}

export default AddProducts;
