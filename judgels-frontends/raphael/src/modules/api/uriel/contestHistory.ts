import { stringify } from 'query-string';

import { APP_CONFIG } from '../../../conf';
import { get } from '../../../modules/api/http';
import { UserRating } from '../jophiel/userRating';
import { ContestInfo } from './contest';

export interface ContestHistoryEvent {
  contestJid: string;
  rating?: UserRating;
}

export interface ContestHistoryResponse {
  data: ContestHistoryEvent[];
  contestsMap: { [key: string]: ContestInfo };
}

const baseURL = `${APP_CONFIG.apiUrls.uriel}/contest-history`;

export const contestHistoryAPI = {
  getHistory: (username: string): Promise<ContestHistoryResponse> => {
    const params = stringify({ username });
    return get(`${baseURL}?${params}`);
  },
};
