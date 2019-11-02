import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { LoadingState } from '../../../../../../../../../components/LoadingState/LoadingState';
import { ContentCard } from '../../../../../../../../../components/ContentCard/ContentCard';
import Pagination from '../../../../../../../../../components/Pagination/Pagination';
import { AppState } from '../../../../../../../../../modules/store';
import { Course } from '../../../../../../../../../modules/api/jerahmeel/course';
import { CourseChapter } from '../../../../../../../../../modules/api/jerahmeel/courseChapter';
import { Chapter } from '../../../../../../../../../modules/api/jerahmeel/chapter';
import { ChapterSubmissionsResponse } from '../../../../../../../../../modules/api/jerahmeel/chapterSubmissionProgramming';
import { ChapterSubmissionsTable } from '../ChapterSubmissionsTable/ChapterSubmissionsTable';
import { selectCourse } from '../../../../../../modules/courseSelectors';
import { selectCourseChapter } from '../../../../modules/courseChapterSelectors';
import { chapterSubmissionActions as injectedChapterSubmissionActions } from '../modules/chapterSubmissionActions';

export interface ChapterSubmissionsPageProps extends RouteComponentProps<{}> {
  course: Course;
  chapter: Chapter;
  courseChapter: CourseChapter;
  onGetProgrammingSubmissions: (
    chapterJid: string,
    userJid?: string,
    problemJid?: string,
    page?: number
  ) => Promise<ChapterSubmissionsResponse>;
  onAppendRoute: (queries) => any;
}

interface ChapterSubmissionsPageState {
  response?: ChapterSubmissionsResponse;
  isFilterLoading?: boolean;
}

export class ChapterSubmissionsPage extends React.PureComponent<
  ChapterSubmissionsPageProps,
  ChapterSubmissionsPageState
> {
  private static PAGE_SIZE = 20;

  state: ChapterSubmissionsPageState = {};

  render() {
    return (
      <ContentCard>
        <h3>Submissions</h3>
        <hr />
        {this.renderSubmissions()}
        {this.renderPagination()}
      </ContentCard>
    );
  }

  private renderSubmissions = () => {
    const { response } = this.state;
    if (!response) {
      return <LoadingState />;
    }

    const { data: submissions, profilesMap, problemAliasesMap } = response;
    if (submissions.totalCount === 0) {
      return (
        <p>
          <small>No submissions.</small>
        </p>
      );
    }

    return (
      <ChapterSubmissionsTable
        course={this.props.course}
        chapter={this.props.courseChapter}
        submissions={submissions.page}
        profilesMap={profilesMap}
        problemAliasesMap={problemAliasesMap}
      />
    );
  };

  private renderPagination = () => {
    return (
      <Pagination
        key={1}
        currentPage={1}
        pageSize={ChapterSubmissionsPage.PAGE_SIZE}
        onChangePage={this.onChangePage}
      />
    );
  };

  private onChangePage = async (nextPage: number) => {
    const data = await this.refreshSubmissions(nextPage);
    return data.totalCount;
  };

  private refreshSubmissions = async (page?: number) => {
    const response = await this.props.onGetProgrammingSubmissions(this.props.chapter.jid, undefined, undefined, page);
    this.setState({ response });
    return response.data;
  };
}

export function createChapterSubmissionsPage(chapterProgrammingSubmissionActions) {
  const mapStateToProps = (state: AppState) => ({
    course: selectCourse(state),
    chapter: selectCourseChapter(state).chapter,
    courseChapter: selectCourseChapter(state).courseChapter,
  });

  const mapDispatchToProps = {
    onGetProgrammingSubmissions: chapterProgrammingSubmissionActions.getSubmissions,
  };

  return withRouter<any, any>(connect(mapStateToProps, mapDispatchToProps)(ChapterSubmissionsPage));
}

export default createChapterSubmissionsPage(injectedChapterSubmissionActions);
