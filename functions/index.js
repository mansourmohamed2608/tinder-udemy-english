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
      //Create the chat document in the chat collection
      const idOfDocument=generateChatId(myId,idOfPersonThatILike)

      await firestore.collection('chats').doc(idOfDocument).set({
        idsConcatenated:idOfDocument,
        arrayofPeopleInConversation:[myId,idOfPersonThatILike]
      },{merge:true})




      response.send("We like Each other successfully done");
    }
    if(type=='breakMatch'){
      //Get the data passed through the API CALL
      
      const myId=body.myId
      const idOfPersonThatILike=body.idOfPersonThatILike

      //Delete all the chat

      const idOfConversation=generateChatId(myId,idOfPersonThatILike);
      const listMessageDocuments=await firestore.collection('chats').doc(chatId).collection('messages').listDocuments())
      listMessageDocuments.forEach((eadhDoc)=>{
        eadhDoc.delete()
      })


      //Delete the user from the "weLikeEachOther" subCollections in both places, in mine, and in the other person's
      // subCollection

      const path1 = `users/${myId}/weLikeEachOther/${idOfPersonThatILike}`
      const path2 = `users/${idOfPersonThatILike}/weLikeEachOther/${myId}`

      //Perform the delete operations
      await firestore.doc(path1).delete()
      await firestore.doc(path2).delete()

      response.send('Deletion Successfull')
    }






   // logger.info("Hello logs!", {structuredData: true});
   response.send("Hello i am a POST");
   });
   const generateChatId= (id,id2)=>{
      const array=[id1,id2]
      array.sort()
      return `${array[0]}-${array[1]}`
   }