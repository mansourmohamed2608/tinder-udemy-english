/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { firestore } = require("firebase-admin");
const admin=require('firebase-admin');
admin.initializeApp();
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.get = onRequest(async(request, response) => {
 // logger.info("Hello logs!", {structuredData: true});
  response.send("Hello i am a get");
 const result= await firestore.collection('users').add({name:'Jesse'})
 });
 exports.post = onRequest((request, response) => {
   // logger.info("Hello logs!", {structuredData: true});
    response.send(result);
   });