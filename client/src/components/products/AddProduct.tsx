import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DefaultImg from './../../assets/default-img.jpg';
import ProductService from '../../services/productService';
import { openSnackbar } from '../shared/dynamicSnackbar/DynamicSnackbarSlice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styles from './AddProduct.module.css';

export default function AddProduct(props: any) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [multerImage, setMulterImage] = useState(DefaultImg);
    const [isEdit, setIsEdit] = useState(false);
    const [product, setProduct] = useState({ name: '', description: '', productImage: '', price: 0 });

    useEffect(() => {
        if (props.match.params.id) {
            ProductService.getProductById(props.match.params.id)
                .then((response: any) => {
                    setProduct(response.data);
                    setIsEdit(true);
                })
                .catch((err: any) => {
                    console.log('error', err);
                })
        }
    }, [props.match.params.id])

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setProduct(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSave = (event: any) => {
        event.preventDefault();
        if (isEdit) {
            product.productImage = product.productImage.replace("/image/getImage/", "");
            ProductService.saveProductById(props.match.params.id, product)
                .then((response: any) => {
                    dispatch(openSnackbar({
                        message: response.data.message,
                        severity: 'success'
                    }))
                    history.push('/');
                })
                .catch((err: any) => {
                    console.log('err', err);
                    history.push('/edit/' + props.match.params.id)
                })
        } else {
            ProductService.addProduct(product)
                .then((response: any) => {
                    dispatch(openSnackbar({
                        message: response.data.message,
                        severity: 'success'
                    }))
                    history.push('/');
                })
                .catch((err: any) => {
                    console.log('err', err)
                    history.push('/products/add');
                })
        }
    }

    const uploadImageToStore = (event: any) => {
        event.preventDefault();
        let file = event.target.files && event.target.files[0];
        if (!file) {
            return;
        }
        let imageFormObj = new FormData();

        imageFormObj.append("imageName", "multer-image-" + Date.now());
        imageFormObj.append("imageData", file);

        const options = {
            onUploadProgress: (progressEvent: any) => {
                const { loaded, total } = progressEvent;
                let percent = Math.floor((loaded * 100) / total);
                console.log(`${loaded}kb of ${total}kb | ${percent}%`)
            }
        }

        setMulterImage(URL.createObjectURL(file));

        ProductService.uploadImageToStore(imageFormObj, options)
            .then((response: any) => {
                if (response.data.success) {
                    setProduct(prev => ({ ...prev, productImage:  isEdit ? `/image/getImage/${response.data.document.Key}` : response.data.document.Key }));
                    dispatch(openSnackbar({
                        message: 'Image has been successfully uploaded',
                        severity: 'success'
                    }))
                }
            }).catch((err: any) => {
                console.log('err', err)
            })
    }

    return (
        <div style={{ overflowY: 'scroll' }}>
            <Container component="main" maxWidth="xs">
                <div className={styles.paper} >
                    <h1>{isEdit ? 'Update Product' : 'Create Product'}</h1>
                    <form className={styles.form} >
                        <TextField
                            name="name"
                            label="name"
                            placeholder="Name"
                            value={product.name}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                        />
                        <br />
                        <TextField
                            name="description"
                            label="description"
                            placeholder="Description"
                            value={product.description}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                        />
                        <br />
                        <TextField
                            name="price"
                            label="price"
                            placeholder="Price"
                            type="number"
                            value={product.price}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                        />
                        <br />
                        <input type="file" name="productImage" onChange={(e) => uploadImageToStore(e)} />
                        <img src={isEdit ? product.productImage : multerImage} alt="uploaded" width="400" height="400" />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            className={styles.submit}
                        >
                            {isEdit ? 'Update' : 'Create'}
                        </Button>
                    </form>
                </div>
            </Container>
        </div>
    )
}