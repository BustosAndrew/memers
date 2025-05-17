import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { createContext, JSX, useContext, useEffect, useState } from 'react';

import myFirebaseConfig from './FirebaseConfig.json';

const myApp = initializeApp(myFirebaseConfig);

const myFS = getFirestore(myApp);

const myAuth = getAuth(myApp);

export const FirebaseContext = createContext({});

interface FirebaseProviderProps {
  children: React.ReactNode;
}

/**
 * A provider component that initializes Firebase and provides the Firebase context.
 *
 * @param {FirebaseProviderProps} props - The props for the provider.
 * @param {React.ReactNode} props.children - The children to render inside the provider.
 * @returns {JSX.Element} The Firebase provider component.
 */
export const FirebaseProvider = (
  props: FirebaseProviderProps,
): JSX.Element | null => {
  const { children } = props;

  if (
    !myFirebaseConfig?.projectId ||
    myFirebaseConfig.projectId.includes('memers-29baa')
  ) {
    console.error(
      'Invalid Firebase configuration in src/providers/FirebaseConfig.json',
    );
  }

  const [firebaseInitializing, setFirebaseInitializing] = useState(true);

  useEffect(() => {
    setFirebaseInitializing(false);
  }, [myAuth, myFS]);

  if (firebaseInitializing) {
    return null;
  }

  const theValues = {
    myApp,
    myAuth,
    myFS,
  };

  return (
    <FirebaseContext.Provider value={theValues}>
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * A hook that returns the FirebaseContext's values.
 *
 * @typedef {Object} FirebaseContextValues
 * @property {import('firebase/app').FirebaseApp} myApp - the Firebase app instance
 * @property {import('firebase/auth').Auth} myAuth - the Firebase Auth instance
 * @property {import('firebase/firestore').Firestore} myFS - the Firestore instance
 * @property {import('firebase/storage').FirebaseStorage} myStorage - the Firebase Cloud Storage instance
 * @property {boolean} usingEmulators - true if using emulators, false otherwise
 * @property {object} emulatorsConfig - configuration for the emulators if `usingEmulators` is true
 *
 * @returns {FirebaseContextValues}
 */
export const useFirebaseContext = () => {
  // get the context
  const context = useContext(FirebaseContext);

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error('useFirebaseContext was used outside of its Provider');
  }

  return context;
};
