const express = require('express');
const fs = require('fs/promises');
const google = require('googleapis');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');

require('dotenv').config();

// Utils
const Utils = require('./utils');
const Db = require('./db');
const moment = require('moment');

const port = process.env.PORT || 3000;
const app = express();

const googleAccounts = google.analytics('v3');
let viewSelected = process.env.ANALYTICS_VIEW_ID;

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const callbackURL = 'http://localhost:3000/login/google/return';
const oauth2Client = new google.auth.OAuth2(clientID, clientSecret, callbackURL);
const url = oauth2Client.generateAuthUrl({
  access_type: 'online',
  scope: 'https://www.googleapis.com/auth/analytics.readonly',
});

app.use(express.static('views'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expressSession({secret: 'as!883@bnr$', resave: true, saveUninitialized: true}));

app.get('/', ( req, res ) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/auth/google', ( req, res ) => {
  res.redirect(url);
});

app.get('/login/google/return', ( req, res ) => {
  oauth2Client.getToken(req.query.code, ( err, tokens ) => {
    viewSelected = '';
    if ( !err ) {
      oauth2Client.setCredentials({
        access_token: tokens.access_token,
      });
      res.redirect('/setcookie');
    } else {
      console.log('Error: ' + err);
    }
  });
});

app.get('/setcookie', ( req, res ) => {
  res.cookie('google-auth', new Date());
  res.redirect('/success');
});

app.get('/success', ( req, res ) => {
  if ( req.cookies['google-auth'] ) {
    res.sendFile(__dirname + '/views/success.html');
  } else {
    res.redirect('/');
  }
});

app.get('/clear', ( req, res ) => {
  viewSelected = '';
  res.redirect('/success');
});

app.get('/getData', async ( req, res ) => {
  if ( req.query.view ) {
    viewSelected = req.query.view;
  }
  
  if ( !viewSelected ) {
    googleAccounts.management.profiles.list(
      {
        accountId: '~all',
        webPropertyId: '~all',
        auth: oauth2Client,
      },
      ( err, data ) => {
        if ( err ) {
          console.error('Error: ' + err);
          res.send('An error occurred');
        } else if ( data ) {
          let views = [];
          data.items.forEach(view => {
            views.push({
              name: view.webPropertyId + ' - ' + view.name + ' (' + view.websiteUrl + ')',
              id: view.id,
            });
          });
          res.send({type: 'views', results: views});
        }
      },
    );
    return;
  }
  
  let data;
  
  /*const startDate = moment()
    .subtract(20, 'months')
    .format('YYYY-MM-DD');
  const endDate = moment().subtract(3, 'months').format('YYYY-MM-DD');*/
  
  const startDate = process.env.ANALYTICS_DATE_START;
  const endDate = process.env.ANALYTICS_DATE_END;

  try {
    data = await Utils.fetchAnalyticsReport({
      oauth2Client, viewSelected, startDate, endDate,
    });
  } catch ( e ) {
    console.log('e:', e);
    return res.send(e.message);
  }
  
  const normalized = Utils.normalizeResponse(data);
  const dimensionsSql = Utils.toListSQL('dimensions', normalized.dimensions);
  const metricsSql = Utils.toListSQL('metrics', normalized.metrics);
  
  let max = 0;
  const views = normalized.metrics.map(v => +v.newusers);
  views.forEach(v => {
    if ( v > max ) {
      max = v;
    }
  })
  
  await Db.query(dimensionsSql);
  await Db.query(metricsSql);
  return res.send([views, max]);
});

// on clicking "logoff" the cookie is cleared
app.get('/logoff', ( req, res ) => {
  res.clearCookie('google-auth');
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
