import React, { useState, useCallback, useMemo } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ja from 'date-fns/locale/ja';
import { RepositoryForm } from './modules/RepositoryForm/RepositoryForm';
import { FetchForm } from './modules/FetchForm/FetchForm';
import { useFetch, User } from './hooks/useFetch/useFetch';
import throttle from 'lodash/throttle';
import { ReactionList } from './modules/ReactionList/ReactionList';
import { ConfigForm } from './modules/ConfigForm/ConfigForm';
import { Filter } from './modules/Filter/Filter';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => createStyles({
  root: {
  },
  container: {
    marginBottom: theme.spacing(2),
    '& > *': {
      marginTop: theme.spacing(1),
    }
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.2)'
  },
  progress: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(50%, 50%)'
  }
}));

export const App = () => {
  const [repos, setRepos] = useState(localStorage.getItem('repos')?.split(',') || ['']);
  const [personalAccessToken, setPersonalAccessToken] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [filterUser, setFilterUser] = useState<User | null>(null);

  const onReposChange = useCallback(throttle((repos: string[]) => {
    setRepos(repos);
    localStorage.setItem('repos', repos.join(','));
  }), []);

  const { fetch, reactions, users, fetching, fetchProgress } = useFetch();

  const filteredReactions = useMemo(() => (
    reactions?.filter(reaction => filterUser ? reaction.user.login === filterUser.login : true) || null
  ), [filterUser, reactions]);

  const onSubmit = useCallback((since: Date) => {
    fetch({ repos, since, baseUrl, personalAccessToken });
  }, [repos, fetch, personalAccessToken]);

  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ja}>
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <Typography>gh-reactions</Typography>
            </Toolbar>
          </AppBar>
          <Container className={classes.container} maxWidth="md">
            <RepositoryForm repos={repos} onChange={onReposChange} />
            <ConfigForm onPersonalAccessTokenChange={setPersonalAccessToken} onBaseUrlChange={setBaseUrl} />
            <FetchForm onSubmit={onSubmit} />
            <Filter users={users} onChange={setFilterUser} />
            <ReactionList reactions={filteredReactions} />
          </Container>
          {fetching ? (
            <div className={classes.overlay}>
              <CircularProgress className={classes.progress} variant="static" value={fetchProgress} />
            </div>
          ) : null}
        </div>
      </MuiPickersUtilsProvider>
    </>
  );
};
