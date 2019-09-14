import { HTMLTable } from '@blueprintjs/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Card } from '../../../../../../components/Card/Card';
import { ContestLink } from '../../../../../../components/ContestLink/ContestLink';
import { LoadingState } from '../../../../../../components/LoadingState/LoadingState';
import { AppState } from '../../../../../../modules/store';
import { getRatingClass, UserRating } from '../../../../../../modules/api/jophiel/userRating';
import { ContestHistoryResponse } from '../../../../../../modules/api/uriel/contestHistory';
import { selectUserJid, selectUsername } from '../../../../modules/profileSelectors';
import { contestHistoryActions as injectedContestHistoryActions } from '../../../../modules/contestHistoryActions';

import './ContestHistoryPage.css';

interface ContestHistoryPageProps {
  userJid: string;
  username: string;
  onGetContestHistory: (username: string) => Promise<ContestHistoryResponse>;
}

interface ContestHistoryPageState {
  response?: ContestHistoryResponse;
}

class ContestHistoryPage extends React.Component<ContestHistoryPageProps, ContestHistoryPageState> {
  state: ContestHistoryPageState = {};

  async componentDidMount() {
    const response = await this.props.onGetContestHistory(this.props.username);
    this.setState({ response });
  }

  render() {
    const { response } = this.state;
    if (!response) {
      return <LoadingState />;
    }

    return (
      <Card title="Contest history">
        <HTMLTable striped condensed className="contest-history-table">
          <thead>
            <tr>
              <th className="col-row">#</th>
              <th>Contest</th>
              <th>Rating change</th>
              <th>Diff</th>
            </tr>
          </thead>
          <tbody>{this.renderRows()}</tbody>
        </HTMLTable>
      </Card>
    );
  }

  private renderRows = () => {
    const { data, contestsMap } = this.state.response!;
    const rows = [];
    let lastRating: UserRating | null = null;

    data.forEach((event, idx) => {
      let ratingChange: JSX.Element | string = '-';
      let ratingDiff: JSX.Element | string = '';

      if (event.rating) {
        if (lastRating === null) {
          ratingChange = <span className={getRatingClass(event.rating)}>{event.rating.publicRating}</span>;
        } else {
          ratingChange = (
            <>
              <span className={getRatingClass(lastRating)}>{lastRating.publicRating}</span>&nbsp;&rarr;&nbsp;
              <span className={getRatingClass(event.rating)}>{event.rating.publicRating}</span>
            </>
          );
          ratingDiff = this.renderRatingDiff(event.rating.publicRating - lastRating.publicRating);
        }
        lastRating = event.rating;
      }

      rows.push(
        <tr key={event.contestJid}>
          <td>{idx + 1}</td>
          <td>
            <ContestLink contest={contestsMap[event.contestJid]} />
          </td>
          <td>{ratingChange}</td>
          <td>{ratingDiff}</td>
        </tr>
      );
    });

    return rows;
  };

  private renderRatingDiff = diff => {
    if (diff === 0) {
      return '0';
    } else if (diff > 0) {
      return <span className="diff-positive">+{diff}</span>;
    } else {
      return <span className="diff-negative">&minus;{-diff}</span>;
    }
  };
}

function createContestHistoryPage(contestHistoryActions) {
  const mapStateToProps = (state: AppState) => ({
    userJid: selectUserJid(state),
    username: selectUsername(state),
  });
  const mapDispatchToProps = {
    onGetContestHistory: contestHistoryActions.getHistory,
  };

  return withRouter<any, any>(connect(mapStateToProps, mapDispatchToProps)(ContestHistoryPage));
}

export default createContestHistoryPage(injectedContestHistoryActions);
