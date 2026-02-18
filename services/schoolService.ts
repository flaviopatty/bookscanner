
import { db } from './firebase';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { School, UserProfile } from '../types';

const SCHOOLS_COLLECTION = 'schools';
const USER_PROFILE_DOC = 'user/profile'; // For simplicity, single user profile for now

export const schoolService = {
    async getUserProfile(): Promise<UserProfile | null> {
        const docRef = doc(db, 'settings', 'profile');
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() as UserProfile : null;
    },

    async saveUserProfile(profile: UserProfile): Promise<void> {
        const docRef = doc(db, 'settings', 'profile');
        await setDoc(docRef, profile);
    },

    async getSchool(): Promise<School | null> {
        const docRef = doc(db, 'settings', 'school');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return null;

        // The doc stores the current school ID
        const { currentSchoolId } = docSnap.data();
        if (!currentSchoolId) return null;

        const schoolRef = doc(db, SCHOOLS_COLLECTION, currentSchoolId);
        const schoolSnap = await getDoc(schoolRef);
        return schoolSnap.exists() ? schoolSnap.data() as School : null;
    },

    async saveSchool(schoolData: Omit<School, 'id'>, existingId?: string): Promise<string> {
        let id = existingId;

        if (!id) {
            id = this.generateSchoolId(schoolData.name);
        }

        const schoolRef = doc(db, SCHOOLS_COLLECTION, id);
        const school: School = { ...schoolData, id };
        await setDoc(schoolRef, school);

        // Update current school link in settings
        await setDoc(doc(db, 'settings', 'school'), { currentSchoolId: id });

        return id;
    },

    generateSchoolId(name: string): string {
        const words = name.split(' ').filter(w => w.length > 2); // filter out 'de', 'do', etc.
        const acronym = words.map(w => w[0].toUpperCase()).join('');

        const randomNum = Math.floor(Math.random() * 90 + 10); // 2 digits
        const randomChars = Math.random().toString(36).substring(2, 4).toUpperCase(); // 2 chars

        return `${acronym}-${randomNum}${randomChars}`;
    },

    async inviteUser(data: { name: string, email: string, role: UserProfile['role'], schoolId: string }): Promise<string> {
        // In a real app, we would use Firebase Auth Admin SDK to create the user
        // and trigger an email. For this demo/mock, we'll create a record in a 'users' collection.
        const tempPassword = Math.random().toString(36).substring(2, 10).toUpperCase();

        const userRef = doc(db, 'users', data.email.replace(/\./g, '_')); // Simple way to use email as ID
        const newUser: UserProfile & { tempPassword?: string, createdAt: any } = {
            name: data.name,
            email: data.email,
            role: data.role,
            schoolId: data.schoolId,
            mustChangePassword: true,
            tempPassword: tempPassword,
            createdAt: new Date().toISOString()
        };

        await setDoc(userRef, newUser);

        // Also create a record in 'invites' for tracking
        const inviteRef = doc(collection(db, 'invites'));
        await setDoc(inviteRef, {
            ...newUser,
            status: 'pending'
        });

        return tempPassword;
    }
};
