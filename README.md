
# What is Job Queue? When will you require it?
Queues can solve a lot of different problems in an interesting way, to reduce the load on processes on one server by breaking up separating heavy processes into other servers. 

Sometimes a process can be heavy and running such jobs in parallel on a machine with limited resources can be inefficient.

- Also some jobs require exclusive access to the system and as we all know our APIs services request concurrently, so that can be a problem.

To resolve these issues we basically maintain a Data Structure called a job `queue` which stores/caches job-description and processes each job in a scheduled manner one by one( given that the response is not wanted immediately)

A job queue maintains a list of processes that are awaiting execution once a condition is satisfied or the workers or processors are prepared to do so.
When you need to carry out a time-consuming activity at a specific speed, this is actually quite helpful.

In Nodejs there are some good libraries to use for queuing processes like `bee-queue`, `bull`, and others. 

## To install prerequirements node.js project. 
```sh 
$ mkdir node-job-queue-app
$ cd node-job-queue-app

npm init 
entry point: (index.js)
npm install express

// Express-generator 
npm install -g express-generator
express --view=ejs
npm install 
npm start 

// Nodemon 
npm install nodemon 
```

## package.json 
```json 
"scripts": {
  "start": "node ./bin/www",
  "dev": "nodemon"
},

npm run dev
```

## Install a job queue library such as Bull 
To integrate a job queue into an existing user authentication Express.js API

```sh 
npm install bull
```

## jobQueue.js
Create a separate file for your job queue, which initializes the queue and sets up any necessary job processing logic. For example, create a file called jobQueue.js

```js 
const Queue = require('bull');

const myQueue = new Queue('myQueueName', {
  redis: {
    port: 6379,
    host: '127.0.0.1'
  }
});

// myQueue.process(async (job) => {
//   console.log(job.data);
//   // Do some work here
// });

module.exports = myQueue;
```


## routes/index.js 
Define a route in your Express.js app that will add a job to the queue when a new user is registered.
Define a separate route that will add a job to the queue when a user requests a password reset.

```js 
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

```


## Worker.js 
Start the worker process to process the jobs in the queue. You can do this in a separate file or as a separate process. For example, create a file called worker.js

```js 
const myQueue = require('./jobQueue');

myQueue.process(async (job) => {
  console.log(job.data);
  
  // Do some work here based on the job type
  switch(job.data.type) {
    case 'register':
      // Process the user registration
      // ...
      console.log('case register processing...'); 
      break;
    case 'reset-password':
      // Process the password reset
      // ...
      break;
    default:
      console.log('Unknown job type');
  }
});

console.log('Worker started');
```

## Run worker.js 
Run the worker process by running node `worker.js` in your terminal. You can also use `pm2` it to run in the background or in a production env.

```sh
node worker.js  
```

## Call api using Postman 

![Screenshot from 2024-03-25 22-40-41](https://gist.github.com/assets/6800568/788fec3d-ad9c-45d7-95e7-df24aa266e61)


## View queue job log 

![Screenshot from 2024-03-25 22-40-22](https://gist.github.com/assets/6800568/7017da04-09d6-46f7-8374-45b282f779dd)


Ref : [Implementing a Job Queue in Node.js: A Practical Guide](https://medium.com/@adarsh-d/implementing-a-job-queue-in-node-js-13a41dbdc98e)

[Node.js: Create Job Queue Using Bull And Redis](https://javascript.plainenglish.io/node-js-create-job-queue-using-bull-and-redis-20fabcee60c5)