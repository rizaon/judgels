import { UnauthorizedError, ForbiddenError } from '../../../../modules/api/error';
import { DelSession } from '../../../../modules/session/sessionReducer';
import { selectToken } from '../../../../modules/session/sessionSelectors';
import { PutWebConfig } from '../../modules/userWebReducer';
import { sessionAPI } from '../../../../modules/api/jophiel/session';
import { SessionErrors } from '../../../../modules/api/jophiel/session';

export function logOut() {
  return async (dispatch, getState) => {
    try {
      await sessionAPI.logOut(selectToken(getState()));
    } catch (error) {
      if (error instanceof ForbiddenError) {
        if (error.message === SessionErrors.LogoutDisabled) {
          throw new Error('Logout is currently disabled.');
        }
      }
      if (!(error instanceof UnauthorizedError)) {
        throw error;
      }
    }
    dispatch(DelSession());
    dispatch(PutWebConfig({ role: {} }));
  };
}
