import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CardMedia,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateProductDetails, setUpdateProductDetails] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://192.168.100.102:4000/get_product', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log('response', response.data);
        setProducts(response.data.array);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getCardShadowColor = (etat) => {
    if (etat === 'hors_stock') {
      return '0px 3px 10px rgba(255, 0, 0, 0.5)';
    } else if (etat === 'en_stock') {
      return '0px 3px 10px rgba(0, 255, 0, 0.5)';
    } else {
      return '0px 3px 10px rgba(0, 0, 0, 0.2)';
    }
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  const handleOverlayClick = () => {
    setSelectedProduct(null);
    setShowConfirmDelete(false); // Reset delete confirmation state
    setShowUpdateForm(false); // Reset update form state
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://192.168.100.102:4000/del_product_user/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setProducts(products.filter((product) => product._id !== productId));
      setSelectedProduct(null);
      setShowConfirmDelete(false); // Close confirmation dialog
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateProduct = async (productId) => {
    try {
      await axios.put(`http://192.168.100.102:4000/update_product_user/${productId}`, updateProductDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setProducts(products.map((product) => (product._id === productId ? { ...product, ...updateProductDetails } : product)));
      setSelectedProduct(null);
      setShowUpdateForm(false); // Close update form
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleConfirmDeleteClick = (e) => {
    e.stopPropagation();
    setShowConfirmDelete(true);
  };

  const handleUpdateClick = (e) => {
    e.stopPropagation();
    setShowUpdateForm(true);
    setUpdateProductDetails({
      nom_produit: selectedProduct.nom_produit,
      categorie_produit: selectedProduct.categorie_produit,
      etat: selectedProduct.etat,
      Marque: selectedProduct.Marque,
      Prix: selectedProduct.Prix,
      Description: selectedProduct.Description
    });
  };

  const handleDialogClose = () => {
    setShowConfirmDelete(false);
    setConfirmDeleteText('');
  };

  const handleUpdateDialogClose = () => {
    setShowUpdateForm(false);
    setUpdateProductDetails({});
  };

  return (
    <>
      {selectedProduct && (
        <Box
          onClick={handleOverlayClick}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300 // Ensure it is above all other elements
          }}
        >
          <Card
            sx={{
              width: 600, // Fixed width
              maxHeight: '80%', // Fixed height, adjust as needed
              overflow: 'auto',
              boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the card
          >
            <CardMedia
              component="img"
              height="300"
              image={`http://192.168.100.102:4000/images/${selectedProduct?.image_name}`}
              alt="product image"
            />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                <b>{selectedProduct.nom_produit}</b>
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 1 }}>
                <b>Category:</b> {selectedProduct.categorie_produit}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 1 }}>
                <b>Status:</b> {selectedProduct.etat === 'hors_stock' ? 'Out of Stock' : 'In Stock'}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 1 }}>
                <b>Brand:</b> {selectedProduct.Marque}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 1 }}>
                <b>Price:</b> ${selectedProduct.Prix}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 1 }}>
                <b>Description:</b> {selectedProduct.Description}
              </Typography>
              <Button variant="contained" color="error" onClick={handleConfirmDeleteClick}>
                Delete
              </Button>
              <Button variant="contained" color="primary" onClick={handleUpdateClick} sx={{ ml: 2 }}>
                Update
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      <Dialog open={showConfirmDelete} onClose={handleDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Type 'delete' to confirm deletion of the product.</DialogContentText>
          <TextField
            fullWidth
            label="Type 'delete' to confirm"
            variant="outlined"
            value={confirmDeleteText}
            onChange={(e) => setConfirmDeleteText(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDeleteProduct(selectedProduct._id)} color="error" disabled={confirmDeleteText !== 'delete'}>
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showUpdateForm} onClose={handleUpdateDialogClose}>
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent>
          <DialogContentText>Update the product details.</DialogContentText>
          <TextField
            fullWidth
            label="Product Name"
            variant="outlined"
            value={updateProductDetails.nom_produit || ''}
            onChange={(e) => setUpdateProductDetails({ ...updateProductDetails, nom_produit: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Category"
            variant="outlined"
            value={updateProductDetails.categorie_produit || ''}
            onChange={(e) => setUpdateProductDetails({ ...updateProductDetails, categorie_produit: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Status"
            variant="outlined"
            value={updateProductDetails.etat || ''}
            onChange={(e) => setUpdateProductDetails({ ...updateProductDetails, etat: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Brand"
            variant="outlined"
            value={updateProductDetails.Marque || ''}
            onChange={(e) => setUpdateProductDetails({ ...updateProductDetails, Marque: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Price"
            variant="outlined"
            type="number"
            value={updateProductDetails.Prix || ''}
            onChange={(e) => setUpdateProductDetails({ ...updateProductDetails, Prix: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            value={updateProductDetails.Description || ''}
            onChange={(e) => setUpdateProductDetails({ ...updateProductDetails, Description: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleUpdateProduct(selectedProduct._id)} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <MainCard title="My Products">
        <Box sx={{ p: 2 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <Card
                    sx={{
                      width: 300, // Fixed width
                      height: 400, // Fixed height
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: getCardShadowColor(product.etat)
                      },
                      boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.2)',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleCardClick(product)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={`http://192.168.100.102:4000/images/${product?.image_name}`}
                      alt="product image"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        <b>{product.nom_produit}</b>
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                        <b>Category:</b> {product.categorie_produit}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                        <b>Status:</b> {product.etat === 'hors_stock' ? 'Out of Stock' : 'In Stock'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                        <b>Brand:</b> {product.Marque}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                        <b>Price:</b> ${product.Prix}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                        <b>Description:</b> {product.Description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </MainCard>
    </>
  );
};

export default AllProducts;
