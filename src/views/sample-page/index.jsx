import React, { useState } from 'react';
import axios from 'axios';

// Material-UI components
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Import upload icon

// Project imports
import MainCard from 'ui-component/cards/MainCard';
import { toast } from 'react-toastify';
import AllProducts from './User_Products';

const categories = ['informatique', 'bureatique', 'personnelle'];
const states = ['en_stock', 'hors_stock'];

const AddNewProductForm = () => {
  const [formValues, setFormValues] = useState({
    nom_produit: '',
    categorie_produit: '',
    etat: '',
    Marque: '',
    Prix: '',
    Description: '',
    image: null // New state for image file
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormValues({
      ...formValues,
      image: file,
      image_name: file.name
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formValues);
      axios.post('http://192.168.100.102:4000/add_product_with_image', formValues, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const formData = new FormData();
      formData.append('image', formValues.image);

      axios.post('http://192.168.100.102:4000/upload_product_image', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data' // Use multipart/form-data for file upload
        }
      });

      toast.success('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product.');
    }
  };

  return (
    <MainCard title="Add New Product">
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%', textDecoration: 'underline' }, // Make text fields 100% width
          '& .MuiButton-containedPrimary': { m: 1, width: 'auto' }, // Adjust button width to auto
          '& .MuiInputBase-root': { m: 1 }, // Reduce margin for input base
          display: 'flex', // Use flex display
          flexDirection: 'column', // Column layout
          alignItems: 'stretch' // Stretch items to full width
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">Product Details</Typography>
        <TextField
          required
          id="nom_produit"
          name="nom_produit"
          label="Product Name"
          value={formValues.nom_produit}
          onChange={handleInputChange}
          InputProps={{ classes: { underline: 'underline' } }} // Underline style
        />
        <TextField
          required
          id="categorie_produit"
          name="categorie_produit"
          select
          label="Category"
          value={formValues.categorie_produit}
          onChange={handleInputChange}
          InputProps={{ classes: { underline: 'underline' } }} // Underline style
        >
          {categories.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          id="etat"
          name="etat"
          select
          label="State"
          value={formValues.etat}
          onChange={handleInputChange}
          InputProps={{ classes: { underline: 'underline' } }} // Underline style
        >
          {states.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          id="Marque"
          name="Marque"
          label="Brand"
          value={formValues.Marque}
          onChange={handleInputChange}
          InputProps={{ classes: { underline: 'underline' } }} // Underline style
        />
        <TextField
          required
          id="Prix"
          name="Prix"
          label="Price"
          type="number"
          value={formValues.Prix}
          onChange={handleInputChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            classes: { underline: 'underline' } // Underline style
          }}
        />
        <TextField
          id="Description"
          name="Description"
          label="Description"
          multiline
          rows={4}
          value={formValues.Description}
          onChange={handleInputChange}
          InputProps={{ classes: { underline: 'underline' } }} // Underline style
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <label htmlFor="image">
            <Button variant="contained" color="secondary" component="span" startIcon={<CloudUploadIcon />}>
              Upload Image
            </Button>
            <input accept="image/*" style={{ display: 'none' }} id="image" type="file" onChange={handleImageChange} />
          </label>
          <Button
            variant="contained"
            color="success"
            type="submit"
            disabled={
              formValues.nom_produit == '' ||
              formValues.categorie_produit == '' ||
              formValues.etat == '' ||
              formValues.Marque == '' ||
              formValues.Prix == ''
            }
          >
            Add Product
          </Button>
        </Box>
      </Box>
      <AllProducts />
    </MainCard>
  );
};

export default AddNewProductForm;
