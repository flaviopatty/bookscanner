
import { db } from './firebase';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { School, UserProfile, Invitation } from '../types';

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

        // Use email as ID for the invite to easily track/update status
        const inviteId = data.email.replace(/\./g, '_');
        const inviteRef = doc(db, 'invites', inviteId);
        await setDoc(inviteRef, {
            ...newUser,
            id: inviteId,
            status: 'pending'
        });

        // Adicionar gatilho para envio de e-mail (Extensão Trigger Email)
        const mailId = inviteId; // Usar o mesmo ID para facilitar o rastreio
        const mailRef = doc(db, 'mail', mailId);
        await setDoc(mailRef, {
            to: data.email,
            inviteId: inviteId, // Referência de volta
            message: {
                subject: 'Convite: BookScanner Pro AI',
                html: `
                    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                        <h2 style="color: #11c4d4;">Olá, ${data.name}!</h2>
                        <p>Você foi convidado para acessar o <b>BookScanner Pro AI</b> como <strong>${data.role}</strong>.</p>
                        <p>Abaixo estão suas credenciais de acesso provisórias:</p>
                        <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; font-family: monospace;">
                            <p style="margin: 5px 0;"><strong>E-mail:</strong> ${data.email}</p>
                            <p style="margin: 5px 0;"><strong>Senha Provisória:</strong> ${tempPassword}</p>
                        </div>
                        <p style="font-size: 12px; color: #666; margin-top: 20px;">
                            * Por segurança, você deverá trocar esta senha no seu primeiro acesso ao sistema.
                        </p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 11px; color: #999; text-align: center;">BookScanner Pro AI - Inteligência na palma da sua mão</p>
                    </div>
                `
            }
        });

        return tempPassword;
    },

    async getInvites(schoolId: string): Promise<Invitation[]> {
        const q = query(
            collection(db, 'invites'),
            where('schoolId', '==', schoolId),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        const invites = await Promise.all(querySnapshot.docs.map(async (d) => {
            const data = d.data();
            const inviteId = d.id;

            // Tentar buscar o status de entrega do e-mail
            const mailRef = doc(db, 'mail', inviteId);
            const mailSnap = await getDoc(mailRef);
            let deliveryStatus: Invitation['deliveryStatus'] = 'PENDING';

            if (mailSnap.exists()) {
                const mailData = mailSnap.data();
                if (mailData.delivery?.state === 'SUCCESS') deliveryStatus = 'SUCCESS';
                if (mailData.delivery?.state === 'ERROR') deliveryStatus = 'ERROR';
            }

            return {
                ...data,
                id: inviteId,
                deliveryStatus
            } as Invitation;
        }));

        return invites;
    }
};
