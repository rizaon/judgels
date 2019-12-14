import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { LoadingState } from '../../../../../../../../components/LoadingState/LoadingState';
import { ContentCard } from '../../../../../../../../components/ContentCard/ContentCard';
import { UserRef } from '../../../../../../../../components/UserRef/UserRef';
import ItemSubmissionUserFilter from '../../../../../../../../components/ItemSubmissionUserFilter/ItemSubmissionUserFilter';
import { AppState } from '../../../../../../../../modules/store';
import { Profile } from '../../../../../../../../modules/api/jophiel/profile';
import { ProblemSet } from '../../../../../../../../modules/api/jerahmeel/problemSet';
import { ProblemSetProblem } from '../../../../../../../../modules/api/jerahmeel/problemSetProblem';
import { SubmissionSummaryResponse } from '../../../../../../../../modules/api/jerahmeel/submissionBundle';
import { SubmissionConfig } from '../../../../../../../../modules/api/jerahmeel/submission';
import { selectProblemSet } from '../../../../../modules/problemSetSelectors';
import { selectProblemSetProblem } from '../../../modules/problemSetProblemSelectors';
import { selectStatementLanguage } from '../../../../../../../../modules/webPrefs/webPrefsSelectors';
import {
  ProblemSubmissionCard,
  ProblemSubmissionCardProps,
} from '../../../../../../../../components/SubmissionDetails/Bundle/ProblemSubmissionsCard/ProblemSubmissionCard';
import { problemSetSubmissionActions as injectedProblemSetSubmissionActions } from '../modules/problemSetSubmissionActions';

interface ProblemSubmissionSummaryPageRoute {
  username?: string;
}

export interface ProblemSubmissionSummaryPageProps extends RouteComponentProps<ProblemSubmissionSummaryPageRoute> {
  problemSet: ProblemSet;
  problem: ProblemSetProblem;
  language?: string;
  onGetSubmissionSummary: (
    problemSetJid: string,
    problemJid: string,
    username?: string,
    language?: string
  ) => Promise<SubmissionSummaryResponse>;
  onRegradeAll: (problemSetJid: string, userJid?: string, problemJid?: string) => Promise<void>;
}

export interface ProblemSubmissionSummaryPageState {
  config?: SubmissionConfig;
  profile?: Profile;
  problemSummaries?: ProblemSubmissionCardProps[];
}

class ProblemSubmissionSummaryPage extends React.Component<
  ProblemSubmissionSummaryPageProps,
  ProblemSubmissionSummaryPageState
> {
  state: ProblemSubmissionSummaryPageState = {};

  async refreshSubmissions() {
    const { problemSet, problem, onGetSubmissionSummary } = this.props;
    const response = await onGetSubmissionSummary(
      problemSet.jid,
      problem.problemJid,
      this.props.match.params.username,
      this.props.language
    );

    const problemSummaries: ProblemSubmissionCardProps[] = response.config.problemJids.map(problemJid => ({
      name: response.problemNamesMap[problemJid] || '-',
      itemJids: response.itemJidsByProblemJid[problemJid],
      submissionsByItemJid: response.submissionsByItemJid,
      canViewGrading: true,
      canManage: response.config.canManage,
      itemTypesMap: response.itemTypesMap,
      onRegrade: () => this.regrade(problemJid),
    }));

    this.setState({ config: response.config, profile: response.profile, problemSummaries });
  }

  async componentDidMount() {
    await this.refreshSubmissions();
  }

  render() {
    return (
      <ContentCard>
        <h3>Results</h3>
        <hr />
        {this.renderUserFilter()}
        <ContentCard>
          Summary for <UserRef profile={this.state.profile} />
        </ContentCard>
        {this.renderResults()}
      </ContentCard>
    );
  }

  private renderUserFilter = () => {
    if (this.props.location.pathname.includes('/users/')) {
      return null;
    }
    return <ItemSubmissionUserFilter />;
  };

  private renderResults = () => {
    const { problemSummaries } = this.state;
    if (!problemSummaries) {
      return <LoadingState />;
    }
    if (problemSummaries.length === 0) {
      return <small>No results.</small>;
    }
    return this.state.problemSummaries.map(props => <ProblemSubmissionCard key={props.alias} {...props} />);
  };

  private regrade = async problemJid => {
    const { userJids } = this.state.config;
    const userJid = userJids[0];

    await this.props.onRegradeAll(this.props.problemSet.jid, userJid, problemJid);
    await this.refreshSubmissions();
  };
}

export function createProblemSubmissionSummaryPage(problemSetSubmissionActions) {
  const mapStateToProps = (state: AppState) => ({
    problemSet: selectProblemSet(state),
    problem: selectProblemSetProblem(state),
    language: selectStatementLanguage(state),
  });

  const mapDispatchToProps = {
    onGetSubmissionSummary: problemSetSubmissionActions.getSubmissionSummary,
    onRegradeAll: problemSetSubmissionActions.regradeSubmissions,
  };

  return withRouter<any, any>(connect(mapStateToProps, mapDispatchToProps)(ProblemSubmissionSummaryPage));
}

export default createProblemSubmissionSummaryPage(injectedProblemSetSubmissionActions);
