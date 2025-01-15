import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import chartData from './chart-data/bajaj-area-chart';

// ===========================|| DASHBOARD DEFAULT - BAJAJ AREA CHART CARD ||=========================== //

const BajajAreaChartCard = () => {
  const theme = useTheme();
  const orangeDark = theme.palette.secondary[800];

  const customization = useSelector((state) => state.customization);
  const { navType } = customization;

  const [balance, setBalance] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Function to fetch prices and calculate difference
    const fetchPrices = async () => {
      try {
        const [instockResponse, offstockResponse] = await Promise.all([
          axios.get('http://192.168.100.102:4000/instock_prices', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }),
          axios.get('http://192.168.100.102:4000/offstock_prices', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          })
        ]);

        const instockPrice = instockResponse.data.totalPrice;
        const offstockPrice = offstockResponse.data.totalPrice;

        // Calculate the balance (difference)
        const balance = instockPrice - offstockPrice;
        setBalance(balance);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching prices:', error);
        setIsLoading(false);
      }
    };

    fetchPrices();
  }, []);

  React.useEffect(() => {
    const newSupportChart = {
      ...chartData.options,
      colors: [orangeDark],
      tooltip: { theme: 'light' }
    };
    ApexCharts.exec(`support-chart`, 'updateOptions', newSupportChart);
  }, [navType, orangeDark]);

  // Determine balance color based on value
  const balanceColor = balance > 0 ? 'green' : balance < 0 ? 'red' : 'grey';

  return (
    <Card sx={{ bgcolor: 'secondary.light' }}>
      <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle1" sx={{ color: 'secondary.dark' }}>
                Balance
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h4"
                sx={{ color: balanceColor }} // Apply conditional color
              >
                {isLoading ? 'Loading...' : `$${balance}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
      <Chart {...chartData} />
    </Card>
  );
};

export default BajajAreaChartCard;
