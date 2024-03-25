var express = require('express');
var router = express.Router();
const myQueue = require('../jobQueue');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', async (req, res) => {
  const userData = req.body;

  // Add the user registration job to the queue
  const response = await myQueue.add({
    type: 'register',
    data: userData
  });

  res.json({message: response.message});
});

router.post('/forgot-password', async (req, res) => {
  const userEmail = req.body.email;

  // Add the password reset job to the queue
  const response = await myQueue.add({
    type: 'reset-password',
    data: { email: userEmail }
  });

  res.json({message: response.message});
});


module.exports = router;
