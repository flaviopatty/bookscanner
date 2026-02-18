
import { auth, db } from './firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    User
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

export const authService = {
    // Escutar mudanças no estado de autenticação
    subscribe(callback: (user: User | null) => void) {
        return onAuthStateChanged(auth, callback);
    },

    // Obter perfil do usuário do Firestore
    async getUserProfile(uid: string): Promise<UserProfile | null> {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() as UserProfile : null;
    },

    // Login com e-mail e senha
    async login(email: string, pass: string) {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // Ao logar, verificar se existe um convite pendente para este email e marcá-lo como aceito
        const inviteId = email.replace(/\./g, '_');
        const inviteRef = doc(db, 'invites', inviteId);
        const inviteSnap = await getDoc(inviteRef);

        if (inviteSnap.exists() && inviteSnap.data().status === 'pending') {
            await updateDoc(inviteRef, { status: 'accepted' });
        }

        return user;
    },

    // Recuperar senha
    async resetPassword(email: string) {
        await sendPasswordResetEmail(auth, email);
    },

    // Cadastro de novo usuário (Diretor)
    async register(name: string, email: string, pass: string) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        const profile: UserProfile = {
            name,
            email,
            role: 'Aluno', // Por padrão, quem se cadastra é Aluno
            mustChangePassword: false
        };

        await setDoc(doc(db, 'users', user.uid), profile);
        return user;
    },

    // Logout
    async logout() {
        await signOut(auth);
    }
};
