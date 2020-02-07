import { selectToken } from '../../../modules/session/sessionSelectors';
import { submissionProgrammingAPI } from '../../../modules/api/jerahmeel/submissionProgramming';
import { toastActions } from '../../../modules/toast/toastActions';

export const submissionActions = {
  getSubmissions: (containerJid?: string, userJid?: string, problemJid?: string, page?: number) => {
    return async (dispatch, getState) => {
      const token = selectToken(getState());
      return await submissionProgrammingAPI.getSubmissions(token, containerJid, userJid, problemJid, page);
    };
  },

  getSubmissionWithSource: (submissionId: number, language?: string) => {
    return async (dispatch, getState) => {
      const token = selectToken(getState());
      const submissionWithSource = await submissionProgrammingAPI.getSubmissionWithSource(
        token,
        submissionId,
        language
      );
      return submissionWithSource;
    };
  },

  regradeSubmission: (submissionJid: string) => {
    return async (dispatch, getState) => {
      const token = selectToken(getState());
      await submissionProgrammingAPI.regradeSubmission(token, submissionJid);

      toastActions.showSuccessToast('Submission regraded.');
    };
  },

  regradeSubmissions: (containerJid: string, userJid?: string, problemJid?: string) => {
    return async (dispatch, getState) => {
      const token = selectToken(getState());
      await submissionProgrammingAPI.regradeSubmissions(token, containerJid, userJid, problemJid);

      toastActions.showSuccessToast('Regrade in progress.');
    };
  },
};
