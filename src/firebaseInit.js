import "firebase/compat/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/messaging";
import { getMessaging, getToken } from "firebase/messaging";
import { saveToken } from "./api/auth";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export async function requestToken() {
  const firebaseConfig = {
    apiKey: "AIzaSyACqkG52CtzYgbl0_EVw8qkUxvWslXB4MA",
    authDomain: "fir-psb-notif-1dd4e.firebaseapp.com",
    projectId: "fir-psb-notif-1dd4e",
    storageBucket: "fir-psb-notif-1dd4e.appspot.com",
    messagingSenderId: "139127533328",
    appId: "1:139127533328:web:6ef745184db40701903f95",
  };
  firebase.initializeApp(firebaseConfig);

  const messaging = getMessaging();
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BIJnu5Rq_eI-nulWKTQ-TwbADc44bfyXZ4oolgf0L-36kdAwHJQKyh-QEaHcALMv4fl5xyohUNsrir-ppoingM4",
    });


  
    await saveToken(token)
  } catch (err) {
    console.log(err);
  }
  //   getToken(messaging, {
  //     vapidKey:
  //       "BIJnu5Rq_eI-nulWKTQ-TwbADc44bfyXZ4oolgf0L-36kdAwHJQKyh-QEaHcALMv4fl5xyohUNsrir-ppoingM4",
  //   })
  //     .then((currentToken) => {
  //     //   deviceUpdate(id, currentToken);

  //     console.log('msuk sini', currentToken)
  //     })
  //     .catch((err) => {
  //       console.log("An error occurred while retrieving token. ", err);
  //       // ...
  //     });
}
