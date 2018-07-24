import { DelContest, PutContest } from './contestReducer';
import { selectToken } from '../../../../modules/session/sessionSelectors';

export const contestActions = {
  getContests: (page: number, pageSize: number) => {
    return async (dispatch, getState, { contestAPI }) => {
      const token = selectToken(getState());
      return await contestAPI.getContests(token, page, pageSize);
    };
  },

  getContestBySlug: (contestSlug: string) => {
    return async (dispatch, getState, { contestAPI }) => {
      const token = selectToken(getState());
      const contest = await contestAPI.getContestBySlug(token, contestSlug);
      dispatch(PutContest.create(contest));
      return contest;
    };
  },

  startVirtualContest: (contestId: string) => {
    return async (dispatch, getState, { contestAPI }) => {
      const token = selectToken(getState());
      await contestAPI.startVirtualContest(token, contestId);
    };
  },

  clearContest: DelContest.create,
};
