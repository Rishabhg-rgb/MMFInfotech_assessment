import * as cron from 'node-cron';
import * as http from 'http';
import * as https from 'https';
import Env from '../constant/env';

const healthCheckUrl = `http://localhost:${Env.SERVER_PORT || 3000}/api/health`;

const performHealthCheck = () => {
  const url = new URL(healthCheckUrl);
  const client = url.protocol === 'https:' ? https : http;

  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: 'GET',
    timeout: 5000, // 5 second timeout
  };

  const req = client.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const response = JSON.parse(data);
          console.log(`✅ Health check successful at ${new Date().toISOString()}:`, response.status);
        } catch (error) {
          console.log(`✅ Health check successful at ${new Date().toISOString()}: Status ${res.statusCode}`);
        }
      } else {
        console.log(`❌ Health check failed at ${new Date().toISOString()}: Status ${res.statusCode}`);
      }
    });
  });

  req.on('error', (error) => {
    console.log(`❌ Health check error at ${new Date().toISOString()}:`, error.message);
  });

  req.on('timeout', () => {
    console.log(`⏰ Health check timeout at ${new Date().toISOString()}`);
    req.destroy();
  });

  req.end();
};

// Schedule health check to run every minute
export const startHealthCheckCron = () => {
  cron.schedule('* * * * *', () => {
    performHealthCheck();
  });

  console.log('🔄 Health check cron job scheduled to run every minute');

  // Perform initial health check
  performHealthCheck();
};