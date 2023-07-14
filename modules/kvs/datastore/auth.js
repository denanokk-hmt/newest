


const auth = async () => {

  // Imports the Google Cloud client library.
  const {Storage} = require('@google-cloud/storage');

  // Instantiates a client. If you don't specify credentials when constructing
  // the client, the client library will look for credentials in the
  // environment.
  const storage = new Storage();

  try {
    // Makes an authenticated API request.
    const results = await storage.getBuckets();

    const [buckets] = results;

    console.log('Buckets:');
    buckets.forEach(bucket => {
      console.log(bucket.name);
    });
  } catch (err) {
    throw new Error(err)
  }
}
module.exports.auth = auth