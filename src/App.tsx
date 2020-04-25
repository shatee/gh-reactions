import React, { useState, useCallback, useMemo } from 'react';
import { CssBaseline, Container, AppBar, Toolbar, Typography, makeStyles, createStyles } from '@material-ui/core';
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

  const { fetch, reactions, users, fetching } = useFetch();

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
          {fetching ? <div className={classes.overlay} /> : null}
        </div>
      </MuiPickersUtilsProvider>
    </>
  );
};
