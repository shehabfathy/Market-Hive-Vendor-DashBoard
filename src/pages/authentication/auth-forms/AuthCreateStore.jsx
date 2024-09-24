import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';

import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MenuItem, Select } from '@mui/material';
import { UploadOutlined } from '@ant-design/icons';
import { Avatar } from '@mui/material';
import Stack from '@mui/material/Stack';

import Typography from '@mui/material/Typography';
import { useFetchCategories } from 'Custom Hooks/useFetchCategories';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { useState } from 'react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// ============================|| Create Store Form ||============================ //

export default function AuthCreateStore() {
  const { categories, categoriesError, isCategoriesLoading } = useFetchCategories();
  const [storeLogo, setStoreLogo] = useState('');
  const navigate = useNavigate();
  return (
    <>
      <Formik
        initialValues={{
          storeLogo: '',
          storeName: '',
          storeCategory: '',
          storeDescription: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          storeLogo: Yup.mixed().required('Store logo is required'),
          storeName: Yup.string().max(255).required('Store Name is required'),
          storeCategory: Yup.string().required('Category is required'),
          storeDescription: Yup.string().max(400).required('Store Description is required')
        })}
        onSubmit={async (inputData) => {
          const storeLogoRef = ref(storage, `StoresImages/${inputData.storeName}-logo.jpg`);
          await uploadBytes(storeLogoRef, inputData.storeLogo);
          const storeLogoURL = await getDownloadURL(storeLogoRef);
          const storeDoc = await addDoc(collection(db, 'Stores'), {
            categoryId: inputData.storeCategory,
            creationDate: new Date(),
            customers: [],
            logo: storeLogoURL,
            name: inputData.storeName,
            orders: [],
            products: [],
            storeDescription: inputData.storeDescription,
            vendorId: auth.currentUser.uid
          });
          await updateDoc(doc(db, 'Vendors', auth.currentUser.uid), {
            storeId: storeDoc.id
          });
          navigate('/');
        }}
      >
        {({ errors, handleBlur, handleChange, isSubmitting, handleSubmit, setFieldValue, touched, values }) => {
          return (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <label htmlFor="fileInput" className="flex justify-center">
                    <input
                      value={''}
                      onChange={(e) => {
                        const logoURL = URL.createObjectURL(e.target.files[0]);
                        setStoreLogo(logoURL);
                        setFieldValue('storeLogo', e.target.files[0]);
                      }}
                      onBlur={handleBlur}
                      name="storeLogo"
                      id="fileInput"
                      type="file"
                      accept="image/png, image/jpg, image/jpeg"
                      className="hidden"
                    />
                    <Avatar sx={{ width: 86, height: 86 }} className="cursor-pointer">
                      {storeLogo ? <img src={storeLogo} alt={`${values.storeName}'s logo'`} /> : <UploadOutlined className="text-4xl" />}
                    </Avatar>
                  </label>
                  {touched.storeLogo && errors.storeLogo && (
                    <FormHelperText error id="helper-text-storeName-signup">
                      {errors.storeLogo}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="storeName-signup">Store Name*</InputLabel>
                    <OutlinedInput
                      id="store-name"
                      type="text"
                      value={values.storeName}
                      name="storeName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="John"
                      fullWidth
                      error={Boolean(touched.storeName && errors.storeName)}
                    />
                  </Stack>
                  {touched.storeName && errors.storeName && (
                    <FormHelperText error id="helper-text-storeName-signup">
                      {errors.storeName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="store-category-signup">Store Category</InputLabel>

                    <Select
                      value={values.storeCategory}
                      name="storeCategory"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.storeCategory && errors.storeCategory)}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>
                  {touched.storeCategory && errors.storeCategory && (
                    <FormHelperText error id="helper-text-store-category-signup">
                      {errors.storeCategory}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="storeDesc-signup">Store Description*</InputLabel>
                    <OutlinedInput
                      id="storeDesc-signup"
                      type="text"
                      value={values.storeDescription}
                      name="storeDescription"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Store Description"
                      multiline
                      rows={4}
                      fullWidth
                      error={Boolean(touched.storeDescription && errors.storeDescription)}
                    />
                  </Stack>
                  {touched.storeDescription && errors.storeDescription && (
                    <FormHelperText error id="helper-text-storeDesc-signup">
                      {errors.storeDescription}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    By Signing up, you agree to our &nbsp;
                    <Link variant="subtitle2" component={RouterLink} to="#">
                      Terms of Service
                    </Link>
                    &nbsp; and &nbsp;
                    <Link variant="subtitle2" component={RouterLink} to="#">
                      Privacy Policy
                    </Link>
                  </Typography>
                </Grid>
                {errors.submit && (
                  <Grid item xs={12}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Create Store
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </>
  );
}
