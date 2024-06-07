import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from './firebase';

const auth = getAuth(app);

export const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
};

export const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
};

export const logout = () => {
    return signOut(auth);
};

export const getCurrentUser = () => {
    return auth.currentUser;
};
