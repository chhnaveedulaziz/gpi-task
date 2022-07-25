const mysql = require('mysql2/promise');

async function createConnection () {
  return mysql.createConnection({
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    user: process.env.DATABASE_USERNAME,
  });
}

let instance;

const getInstance = async () => {
  return instance ? instance : (instance = await createConnection());
};

async function query ( sql ) {
  const conn = await getInstance();
  return conn.execute(sql);
}

/**
 * Insert values into table
 * @param {string} tableName
 * @param {Array<string>} columns - Columns (e.g., ['column1', 'column2', ...)
 * @param {Array<string[]>} values - Values (e.g., [[], [], ...]
 * @return {Promise<any>}
 */
async function insert ( tableName, columns, values ) {
  return query(toInsertSQL(tableName, columns, values));
}

const toInsertSQL = ( tableName, columns, values ) => {
  if ( !columns.length ) {
    throw new Error('Columns are required');
  }
  
  if ( !values.length ) {
    throw new Error('Values cannot be empty');
  }
  
  const rows = [];
  
  for ( const value of values ) {
    rows.push('(' + value.map(mysql.escape).join(', ') + ')');
  }
  
  return `INSERT INTO ${tableName} `
    + `(${columns.join(', ')})`
    + `VALUES ${rows.join(`,`)};`;
};

module.exports = {
  getInstance, query, insert, toInsertSQL,
};