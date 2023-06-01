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
const functions = require("firebase-functions");

const admin=require('firebase-admin');

admin.initializeApp();
const firestore=admin.firestore();
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started
exports.get = functions.https.onRequest( async (request, response) => {
  // functions.logger.info("Hello logs!", {structuredData: true});
  

  // We execute an insertion inside the users collection of the object {name:'jesse'}
  const result = await firestore.collection('users').add({name:'Jesse'})

  // I return the result to the navigator
  response.send(result);
 });

 exports.post = functions.https.onRequest( async (request, response) => {
  const body=request.body
    const type=body.type
    
    if(type==='personLikesMe'){
      const myId=body.myId
      const idOfPersonThatILike=body.idOfPersonThatILike
      await firestore.collection('users').doc(idOfPersonThatILike).collection('theyLikeMe').doc(myId).set(
        {
          uid:myId,
          documentReference: firestore.collection('users').doc(myId)   
        }
        ,
        {merge:true})
        response.send("Successfull");
    }
    if(type=='IDontLikeYou'){
      const myId=body.myId
      const idOfPersonThatIDontLike=body.idOfPersonThatIDontLike
      await firestore.collection('users').doc(myId).collection('theyLikeMe').doc(idOfPersonThatIDontLike).delete()
      response.send("Successfully Deleted")
      
      if(type==='weLikeEachOther'){
        const myId=body.myId
        const idOfPersonThatILike=body.idOfPersonThatILike
        //I prepare the 2 objects
        //Other PersonsObject
        const otherPersonObject ={
          uid:idOfPersonThatILike,
          documentReference:firestore.collection('users').doc(idOfPersonThatILike)
        }
        //My Object 
        const myObject ={
          uid:myId,
          documentReference:firestore.collection('users').doc(myId)
        }
      }
      // 2Inserts in weLikeEach other subcollection
      await firestore.collection('users').doc(idOfPersonThatILike).collection('weLikeEachOther').doc(myId).set(myObject,{merge:true})
      await firestore.collection('users').doc(myId).collection('weLikeEachOther').doc(idOfPersonThatILike).set(otherPersonObject,{merge:true})
      // Delete the document from my subCollection of "theyLikeMe" 
      await firestore.collection('users').doc(myId).collection('theyLikeMe').doc(idOfPersonThatILike).delete()
      response.send("We like Each other successfully done");

    }






   // logger.info("Hello logs!", {structuredData: true});
   response.send("Hello i am a POST");
   });