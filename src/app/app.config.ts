import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule, } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { firebaseConfig } from './constants';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
  importProvidersFrom([AngularFireModule.initializeApp(firebaseConfig), AngularFireAuthModule, AngularFireDatabaseModule, AngularFirestoreModule]),
  provideFirebaseApp(()=>initializeApp(firebaseConfig)),
  provideAuth(()=>getAuth()),
  provideDatabase(()=>getDatabase()),
  provideFirestore(()=>getFirestore())
  ]
};
