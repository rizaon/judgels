import { selectToken } from '../../../../../../../../modules/session/sessionSelectors';
import { chapterLessonAPI } from '../../../../../../../../modules/api/jerahmeel/chapterLesson';
import { chapterProblemAPI } from '../../../../../../../../modules/api/jerahmeel/chapterProblem';

export function getResources(chapterJid) {
  return async (dispatch, getState) => {
    const token = selectToken(getState());
    return await Promise.all([
      chapterLessonAPI.getLessons(token, chapterJid),
      chapterProblemAPI.getProblems(token, chapterJid),
    ]);
  };
}
