import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Initialize the GA4 client
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  projectId: process.env.GOOGLE_PROJECT_ID,
});

export async function getAnalyticsData(startDate: string, endDate: string) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'bounceRate' },
      ],
    });

    // Extract metrics from the response
    const metrics = response.rows?.[0]?.metricValues || [];
    
    return {
      pageViews: parseInt(metrics[0]?.value || '0'),
      users: parseInt(metrics[1]?.value || '0'),
      sessions: parseInt(metrics[2]?.value || '0'),
      bounceRate: parseFloat(metrics[3]?.value || '0'),
    };
  } catch (error) {
    console.error('Error fetching GA4 data:', error);
    throw error;
  }
} 