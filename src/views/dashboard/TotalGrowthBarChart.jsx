import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third-party
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// initial chart data
import initialChartData from './chart-data/total-growth-bar-chart';

const TotalGrowthBarChart = ({ isLoading }) => {
  const [inStockChartData, setInStockChartData] = useState(initialChartData);
  const [outOfStockChartData, setOutOfStockChartData] = useState(initialChartData);
  const [priceDifference, setPriceDifference] = useState(0);
  const theme = useTheme();

  const { primary } = theme.palette.text;
  const divider = theme.palette.divider;
  const grey500 = theme.palette.grey[500];

  // Effect to initialize chart options
  useEffect(() => {
    const inStockChartOptions = {
      ...initialChartData.options,
      colors: ['#28a745'], // Green color for In Stock
      xaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      grid: { borderColor: divider },
      tooltip: { theme: 'light' },
      legend: { labels: { colors: grey500 } }
    };

    const outOfStockChartOptions = {
      ...initialChartData.options,
      colors: ['#dc3545'], // Red color for Out of Stock
      xaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      grid: { borderColor: divider },
      tooltip: { theme: 'light' },
      legend: { labels: { colors: grey500 } }
    };

    setInStockChartData((prevData) => ({
      ...prevData,
      options: inStockChartOptions
    }));

    setOutOfStockChartData((prevData) => ({
      ...prevData,
      options: outOfStockChartOptions
    }));
  }, [primary, divider, grey500]);

  // Effect to fetch prices and update chart data
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const [instockRes, outofstockRes] = await Promise.all([
          axios.get('http://192.168.100.102:4000/instock_prices', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('http://192.168.100.102:4000/offstock_prices', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        console.log('In Stock Prices Response:', instockRes.data);
        console.log('Out of Stock Prices Response:', outofstockRes.data);

        const inStockTotal = instockRes.data.totalPrice ?? 0;
        const outOfStockTotal = outofstockRes.data.totalPrice ?? 0;

        console.log('In Stock Total:', inStockTotal);
        console.log('Out of Stock Total:', outOfStockTotal);

        const updatedInStockChartData = {
          series: [{ name: 'In Stock', data: [inStockTotal] }],
          options: inStockChartData.options
        };

        const updatedOutOfStockChartData = {
          series: [{ name: 'Out of Stock', data: [outOfStockTotal] }],
          options: outOfStockChartData.options
        };

        console.log('Updated In Stock Chart Data:', updatedInStockChartData);
        console.log('Updated Out of Stock Chart Data:', updatedOutOfStockChartData);

        setInStockChartData(updatedInStockChartData);
        setOutOfStockChartData(updatedOutOfStockChartData);
        setPriceDifference(inStockTotal - outOfStockTotal);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">Total Growth</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">${priceDifference.toLocaleString()}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">In Stock against Out of Stock</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" align="center">
                Out of Stock
              </Typography>
              <div style={{ width: '100%', height: '300px' }}>
                <Chart options={outOfStockChartData.options} series={outOfStockChartData.series} type="bar" height="100%" width="100%" />
              </div>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" align="center">
                In Stock
              </Typography>
              <div style={{ width: '100%', height: '300px' }}>
                <Chart options={inStockChartData.options} series={inStockChartData.series} type="bar" height="100%" width="100%" />
              </div>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
