var AWS = require('aws-sdk');
// var uuid = require('node-uuid');
// var img = require('../client/dist/images/twitter-egg.png')
var s3 = new AWS.S3();
var fs = require('fs');
var bucketName = 'reslack';


// var path = '../client/dist/images/twitter-egg.png';

// awsUploader
/*
Takes in two parameters: keyName and data.

keyName = req.file.originalname;
data= req.file.buffer;

*/


var awsUploader = (keyName, data, callback) => {
  s3.createBucket({Bucket: bucketName}, () => {
    var params = {Bucket: bucketName, Key: keyName, Body: data, ACL: 'public-read'};

    s3.putObject(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("successfully uploaded data to " + bucketName + "/" + keyName)
        callback()
      }
    })
  });
}


module.exports.awsUploader = awsUploader;
