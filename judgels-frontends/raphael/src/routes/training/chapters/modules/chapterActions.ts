import { selectToken } from '../../../../modules/session/sessionSelectors';
import { chapterAPI, ChapterCreateData, ChapterUpdateData } from '../../../../modules/api/jerahmeel/chapter';
import * as toastActions from '../../../../modules/toast/toastActions';

export function createChapter(data: ChapterCreateData) {
  return async (dispatch, getState) => {
    const token = selectToken(getState());
    await chapterAPI.createChapter(token, data);
    toastActions.showSuccessToast('Chapter created.');
  };
}

export function updateChapter(chapterJid: string, data: ChapterUpdateData) {
  return async (dispatch, getState) => {
    const token = selectToken(getState());
    await chapterAPI.updateChapter(token, chapterJid, data);
    toastActions.showSuccessToast('Chapter updated.');
  };
}

export function getChapters() {
  return async (dispatch, getState) => {
    const token = selectToken(getState());
    return await chapterAPI.getChapters(token);
  };
}