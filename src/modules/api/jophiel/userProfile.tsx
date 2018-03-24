import { APP_CONFIG } from '../../../conf';
import { get, put } from '../http';

export interface UserProfile {
  name?: string;
  gender?: string;
  nationality?: string;
  homeAddress?: string;
  institution?: string;
  country?: string;
  province?: string;
  city?: string;
  shirtSize?: string;
}

export const userProfileGender = {
  ['MALE']: 'Male',
  ['FEMALE']: 'Female',
};

export function createUserProfileAPI() {
  const baseURL = `${APP_CONFIG.apiUrls.jophiel}/users`;

  return {
    getUserProfile: (token: string, userJid: string): Promise<UserProfile> => {
      return get(`${baseURL}/${userJid}/profile`, token);
    },

    updateUserProfile: (token: string, userJid: string, userProfile: UserProfile): Promise<void> => {
      return put(`${baseURL}/${userJid}/profile`, token, userProfile);
    },
  };
}
