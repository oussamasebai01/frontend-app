import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';

// material-ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = ({ isLoading }) => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch products and filter them
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://192.168.100.102:4000/get_product', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Fetched products:', response.data.array); // Debugging line

      const filteredProducts = response.data.array
        .filter((product) => product.etat === 'en_stock' || product.etat === 'hors_stock') // Filter products based on stock status
        .slice(0, 5); // Limit to 5 products

      console.log('Filtered products:', filteredProducts); // Debugging line

      setProducts(filteredProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      {loading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid container alignContent="center" justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h4">Balance Stocks</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ pt: '16px !important' }}>
                <BajajAreaChartCard />
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="column">
                  {products.length > 0 ? (
                    products.map((product, index) => {
                      // Determine color based on stock status
                      const stockColor = product.etat === 'en_stock' ? 'green' : 'red';

                      return (
                        <React.Fragment key={index}>
                          <Grid item>
                            <Grid container alignItems="center" justifyContent="space-between">
                              <Grid item>
                                <Typography variant="subtitle1" color="inherit">
                                  {product.nom_produit}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Grid container alignItems="center" justifyContent="space-between">
                                  <Grid item>
                                    <Typography variant="subtitle1" color="inherit" sx={{ color: stockColor }}>
                                      ${product.Prix}
                                    </Typography>
                                  </Grid>
                                  <Grid item>
                                    <Avatar
                                      variant="rounded"
                                      sx={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: '5px',
                                        bgcolor: stockColor === 'green' ? 'success.light' : 'error.light',
                                        color: stockColor === 'green' ? 'success.dark' : 'error.dark',
                                        ml: 2
                                      }}
                                    >
                                      {stockColor === 'green' ? (
                                        <KeyboardArrowUpOutlinedIcon fontSize="small" color="inherit" />
                                      ) : (
                                        <KeyboardArrowDownOutlinedIcon fontSize="small" color="inherit" />
                                      )}
                                    </Avatar>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Divider sx={{ my: 1.5 }} />
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" color="inherit">
                        No products available
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button href="/products" size="small" disableElevation>
              View All
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
};

PopularCard.propTypes = {
  isLoading: PropTypes.bool
};

export default PopularCard;
