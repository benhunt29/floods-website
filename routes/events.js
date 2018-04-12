const express = require('express')
const router = express.Router()
const rp = require('request-promise')
const mailer = require('../modules/mailer')

/* GET events. */
router.get('/', function (req, res, next) {
  getShows()
    .then(function (data) {
      if (data) {
        res.status(200).json(data)
      } else {
        res.status(200)
      }
    })
})

function getShows () {
  const options = {
    uri: 'https://graph.facebook.com/v2.12/' + process.env.FB_ID + '/events?access_token=' + process.env.FB_ACCESS_TOKEN,
    json: true // Automatically parses the JSON string in the response
  }

  return rp(options)
    .then(function (res) {
      return res
    })
    .catch(function (err) {
      mailer.sendMail(JSON.stringify(err))
    })
}

module.exports = router
