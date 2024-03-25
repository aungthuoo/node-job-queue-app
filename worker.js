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