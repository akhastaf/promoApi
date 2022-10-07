import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';

@Injectable()
export class PushService {
    constructor() {
        // const firebaseCredentials = JSON.parse(process.env.FIREBASE_CREDENTIAL_JSON);
        // firebase.initializeApp({
        // credential: firebase.credential.cert(firebaseCredentials),
        // databaseURL: process.env.FIREBASE_DATABASE_URL,
        // });
    }
}
