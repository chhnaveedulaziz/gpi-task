const op = require('object-path');
const google = require('googleapis');
const googleAnalytics = google.analyticsreporting('v4');

// Utils
const db = require('./db');

const dimensions = [
  {
    'name': 'ga:campaign',
  },
  {
    'name': 'ga:source',
  },
  {
    'name': 'ga:medium',
  },
];

const metrics = [
  {
    'expression': 'ga:newusers',
  },
  {
    'expression': 'ga:sessions',
  },
  {
    'expression': 'ga:hits',
  },
  {
    'expression': 'ga:users',
  },
];

const fetchAnalyticsReport = async ( {oauth2Client, viewSelected, startDate, endDate} ) => {
  const repReq = [
    {
      viewId: viewSelected,
      dateRanges: [
        {
          startDate, //: process.env.ANALYTICS_DATE_START,
          endDate, //: process.env.ANALYTICS_DATE_END,
        },
      ],
      metrics,
      dimensions,
    },
  ];
  
  return new Promise(( resolve, reject ) => {
    googleAnalytics.reports.batchGet(
      {
        headers: {
          'Content-Type': 'application/json',
        },
        auth: oauth2Client,
        resource: {
          reportRequests: repReq,
        },
      },
      ( err, data ) => {
        if ( err ) {
          reject(new Error('An error occurred'));
        } else if ( data ) {
          resolve(op.get(data, 'reports.0'));
        }
      },
    );
  });
};

const normalizeResponse = data => {
  const accessor = op(data);
  
  if ( !accessor.get('data.rows', []).length ) {
    return null;
  }
  
  const dimensions = [];
  const metrics = [];
  
  const dimensionsColumn = accessor.get('columnHeader.dimensions')
    .map(v => v.replace(/^ga:/, ''));
  
  const metricsColumn = accessor.get('columnHeader.metricHeader.metricHeaderEntries')
    .map(v => v.name.replace(/^ga:/, ''));
  
  for ( const row of accessor.get('data.rows', []) ) {
    //<editor-fold desc="Dimensions normalizer">
    const dimensionRow = {};
    for ( let i = 0; i < row.dimensions.length; i++ ) {
      dimensionRow[dimensionsColumn[i]] = row.dimensions[i];
    }
    dimensions.push(dimensionRow);
    //</editor-fold>
    
    //<editor-fold desc="Metrics normalizer">
    const metricRow = {};
    const metricsValues = op.get(row, 'metrics.0.values', []);
    for ( let i = 0; i < metricsValues.length; i++ ) {
      metricRow[metricsColumn[i]] = metricsValues[i];
    }
    metrics.push(metricRow);
    //</editor-fold>
  }
  
  return {
    dimensions,
    metrics,
  };
};

function toListSQL ( tableName, rows = [] ) {
  if ( !rows.length ) {
    return null;
  }
  
  const columns = Object.keys(rows[0]);
  const values = [];
  
  for ( const row of rows ) {
    values.push(Object.values(row))
  }
  
  return db.toInsertSQL(tableName, columns, values);
}

module.exports = {
  fetchAnalyticsReport,
  normalizeResponse,
  toListSQL,
};