import { initFirebase } from './initFirebaseApp';

const {fs} = initFirebase();

export interface Profile {
  idHash: string,
  firstName: string,
  lastName: string,
  phone: string,
  createdAt: number,  // moment().unix()
}

export async function registerProfile(profile: Profile) {
  await fs
    .collection('profiles')
    .doc(profile.idHash)
    .set(profile);
}

export async function getExistingNricProfile(idHash: string): Promise<Profile | undefined> {
  try {
    return fs
    .collection('profiles')
    .doc(idHash)
    .get()
    .then(snapshot => snapshot.data() as Profile);
  } catch (error) {
    return undefined;  // Nope, doesn't exist.
  }
}

export async function getExistingNameProfile(firstName: string, lastName: string): Promise<Profile | undefined> {
    const matches = await fs
        .collection('profiles')
        .where('firstName', '==', firstName)
        .where('lastName', '==', lastName)
        .get()
        .then(snapshot => snapshot.docs.map(doc => doc.data() as Profile));
    
    return matches.length > 0 ? matches[0] : undefined;
}
