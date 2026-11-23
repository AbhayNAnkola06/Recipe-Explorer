
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';

import type { User } from 'firebase/auth';

import { auth } from './firebase';

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(result.user, {
    displayName: name
  });

  return result.user;
}

export async function loginUser(
  email: string,
  password: string
) {
  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export function checkAuth(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, callback);
}
