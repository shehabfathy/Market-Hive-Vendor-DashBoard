import * as Yup from 'yup';
import { ButtonBase } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { ExclamationCircleOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { Progress } from 'antd';
import { useNavigate } from 'react-router';
import { addDoc, arrayRemove, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../../firebase';
import { useFetchVendor } from 'Custom Hooks/useFetchVendor';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';
import { useFetchStore } from 'Custom Hooks/useFetchStore';
function AddProductForm({ productImg, percentage, setProductImg, images, edite, setEdite, record, setImagesUrls }) {
  //TODO: Add auth.currentUesr.uid to be vendor
  const { vendor } = useFetchVendor(auth.currentUser.uid);
  const { store } = useFetchStore(vendor.storeId);
  const [recordImages, setRecordImages] = useState(record?.images);

  const navigate = useNavigate();

  // Yup Schema
  const addProductSchema = Yup.object().shape({
    productTitle: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    price: Yup.number().typeError('Price must be a number').positive('Price must be a positive number').required('Price is required'),
    stockQuantity: Yup.number().required('Please enter the quantity of product'),
    discount: Yup.number()
      .min(0, 'Discount must be at least 0')
      .max(1, 'Discount cannot be more than 1')
      .required('Discount is required')
      .typeError('Discount must be a number')
      .test(
        'is-decimal',
        'Discount must be a decimal number between 0 and 1',
        (value) => value >= 0 && value <= 1 && /^[0-9]+(\.[0-9]+)?$/.test(value)
      ),
    images: Yup.array().of(Yup.mixed().required('Image is required')).min(1, 'At least one image is required')
  });

  // File Change while upload product image
  const handleFileChange = (e, setFieldValue) => {
    const newProductImg = Array.from(e.target.files);
    setFieldValue('images', '');
    setProductImg((prevProductImg) => [...prevProductImg, ...newProductImg]);
  };

  // Delete product image at form before add product
  const handleDelete = (name) => {
    const imgName = new Date().getDate() + name;
    const deleteImg = productImg.filter((img) => img.name !== name);
    const storageRef = ref(storage, `ProductImages/${imgName}`);
    deleteObject(storageRef)
      .then(() => {
        console.log('File deleted successfully');
        // Update the state to remove the image from the list
        setProductImg(deleteImg);
      })
      .catch((error) => {
        console.error('Error deleting file:', error);
      });
    images.pop();
    setProductImg(deleteImg);
  };

  // Delete product image at form editing status
  const handleEditeDelete = async (name) => {
    console.log(name);
    const deleteImg = recordImages.filter((img) => img !== name);
    setImagesUrls(deleteImg);
    setRecordImages(deleteImg);
    console.log(recordImages);
    await updateDoc(doc(db, 'Products', record.id), {
      images: arrayRemove(name)
    });
  };

  // Add product and navigate to products list
  const onAddProduct = async (values, actions) => {
    if (edite && images[0]) {
      try {
        await updateDoc(doc(db, 'Products', record.id), {
          title: values.productTitle,
          description: values.description,
          price: values.price,
          stockQuantity: values.stockQuantity,
          discount: values.discount,
          images,
          categoryId: store.categoryId,
          creationDate: new Date()
        });

        actions.resetForm();
        setEdite(false);
        navigate('/products');
      } catch (error) {
        console.log(error);
      }
    } else if (images[0])
      try {
        const docRef = await addDoc(collection(db, 'Products'), {
          title: values.productTitle,
          categoryId: store.categoryId,
          description: values.description,
          price: values.price,
          stockQuantity: values.stockQuantity,
          discount: values.discount,
          images: images,
          reviews: [],
          creationDate: new Date(),
          storeId: vendor.storeId
        });
        console.log('Document written with ID: ', docRef.id);
        await updateDoc(doc(db, 'Stores', vendor.storeId), {
          products: arrayUnion(docRef.id)
        });
        console.log('done');
        console.log(values);
        console.log(images);
        actions.resetForm();
        navigate('/products');
      } catch (error) {
        console.log(error);
      }
  };

  if (record?.price) {
    var { price, title, description, stockQuantity, discount } = record;
  }

  return (
    <div>
      <Formik
        initialValues={
          edite
            ? {
                productTitle: title,
                description: description,
                price: price,
                stockQuantity: stockQuantity,
                discount: discount,
                images: images
              }
            : {
                productTitle: '',
                description: '',
                price: '',
                stockQuantity: '',
                discount: '',
                images: []
              }
        }
        validationSchema={addProductSchema}
        onSubmit={onAddProduct}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>
            <div>
              <label htmlFor="productTitle">Product Title</label>
              <Field
                type="text"
                id="productTitle"
                name="productTitle"
                className={`field ${errors.productTitle && touched.productTitle ? 'border-red-500' : 'border-gray-300'}`}
              />

              {errors.productTitle && touched.productTitle && (
                <div className="text-red-500 text-sm">
                  <ExclamationCircleOutlined className="mr-1" />
                  {errors.productTitle}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <Field
                type="text"
                id="description"
                name="description"
                className={`field ${errors.description && touched.description ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.description && touched.description && (
                <div className="text-red-500 text-sm">
                  <ExclamationCircleOutlined className="mr-1" />
                  {errors.description}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="price">price</label>
              <Field
                type="text"
                id="price"
                name="price"
                className={`field ${errors.price && touched.price ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.price && touched.price && (
                <div className="text-red-500 text-sm">
                  <ExclamationCircleOutlined className="mr-1" />
                  {errors.price}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="stockQuantity">Stock Quantity</label>
              <Field
                type="text"
                id="stockQuantity"
                name="stockQuantity"
                className={`field ${errors.stockQuantity && touched.stockQuantity ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.stockQuantity && touched.stockQuantity && (
                <div className="text-red-500 text-sm">
                  <ExclamationCircleOutlined className="mr-1" />
                  {errors.stockQuantity}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="discount">Discount</label>
              <Field
                type="text"
                id="discount"
                placeholder="0.25"
                name="discount"
                className={`field ${errors.discount && touched.discount ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.discount && touched.discount && (
                <div className="text-red-500 text-sm">
                  <ExclamationCircleOutlined className="mr-1" />
                  {errors.discount}
                </div>
              )}
            </div>
            <div>
              <div className="flex gap-2">
                <label className="block mt-2 cursor-pointer" htmlFor="images">
                  <CloudUploadOutlined className="text-4xl" /> : Upload Product Images
                </label>
              </div>
              <Field
                value={''}
                id="images"
                type="file"
                className="hidden"
                name="images"
                accept="image/png, image/jpeg"
                multiple
                onChange={(e) => {
                  handleFileChange(e, setFieldValue);
                }}
              />
              {productImg && (
                <div className="flex gap-6 mt-2 flex-wrap">
                  {productImg.map((img, i) => (
                    <div key={i} className="relative">
                      <img className="w-32 h-48 object-fit" src={URL.createObjectURL(img)} alt="product images" />
                      <Progress percent={percentage} size="small" />
                      <button
                        onClick={() => handleDelete(img.name)}
                        className="absolute -top-2 -right-2 text-md bg-red-500 rounded-full p-1"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errors.images && touched.images && (
                <div className="text-red-500 text-sm">
                  <ExclamationCircleOutlined className="mr-1" />
                  {errors.images}
                </div>
              )}
            </div>

            {edite ? (
              <div className="flex gap-6 mt-2">
                {recordImages.map((img, i) => (
                  <div key={i} className="relative">
                    <img className="w-32 h-48 object-fit" src={img} alt="product" />
                    <button
                      type="button"
                      onClick={() => handleEditeDelete(img)}
                      className="absolute -top-2 -right-2 text-md bg-red-500 rounded-full p-1"
                    >
                      X
                    </button>
                  </div>
                ))}
                {images.length == 0 ? (
                  <div className="text-red-500 text-sm">
                    <ExclamationCircleOutlined className="mr-1" />
                    At least one image is required
                  </div>
                ) : (
                  ''
                )}
              </div>
            ) : (
              ''
            )}
            <ButtonBase
              disabled={percentage !== null && percentage < 100}
              type="submit"
              className={`w-1/2 bg-sky-500 p-2 rounded-md mt-3 mx-auto flex ${percentage !== null && percentage < 100 ? `opacity-25 cursor-not-allowed` : 'opacity-100 cursor-pointer'} `}
            >
              {!edite ? 'Add Product' : ' Update Product'}
            </ButtonBase>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddProductForm;
