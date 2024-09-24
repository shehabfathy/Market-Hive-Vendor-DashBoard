import { storage } from '../../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
export const UploadImage = (productImg, setImagesUrls, setPercentage) => {
  productImg.map((img) => {
    const name = new Date().getDate() + img.name;

    const storageRef = ref(storage, `ProductImages/${name}`);

    const uploadTask = uploadBytesResumable(storageRef, img);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed();
        setPercentage(progress);
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default:
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImagesUrls((prev) => [...prev, downloadURL]);
          console.log('File available at', downloadURL);
        });
      }
    );
  });
};
