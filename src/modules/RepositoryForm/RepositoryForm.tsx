import React, { useCallback, useState, useEffect } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';

type Props = {
  repos: string[];
  onChange: (repos: string[]) => void;
};

const useStyles = makeStyles(theme => createStyles({
  root: {},
  shortRepos: {
    marginLeft: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  details: {
    flexDirection: 'column',
    '& > * + *': {
      marginTop: theme.spacing(1)
    }
  }
}));

export const RepositoryForm = ({ repos, onChange }: Props) => {
  const [shortRepos, setShortRepos] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setShortRepos(repos.map(repo => {
        const matches = repo.match(/^https?:\/\/[^/]+\/([^/]+\/[^/]+)/);
        return matches ? matches[1] : '';
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, [repos]);

  const onRepoInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const i = e.currentTarget.getAttribute('data-index');
    if (i === null) return;
    repos[parseInt(i, 10)] = e.currentTarget.value;
    onChange(repos);
  }, [repos, onChange]);

  const onAddRepoClick = useCallback(() => {
    onChange([...repos, '']);
  }, [repos, onChange]);

  const onDeleteRepoClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const dataIndex = e.currentTarget.getAttribute('data-index');
    if (dataIndex === null) return;
    const i = parseInt(dataIndex, 10);
    if (Number.isNaN(i)) return;
    onChange([...repos.slice(0, i), ...repos.slice(i + 1)]);
  }, [repos]);

  const classes = useStyles();

  return (
    <section className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary>
          <Typography variant="h6" component="h1">
            Repository
          </Typography>
          <Typography className={classes.shortRepos} color="textSecondary">
            {shortRepos.join(' & ')}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          {repos.map((repo, i) => (
            <TextField
              label="Repo URL"
              defaultValue={repo}
              key={`${repo}_${i}`}
              onChange={onRepoInput}
              InputProps={{
                endAdornment: repos.length > 1 ? (
                  <InputAdornment position="end">
                    <IconButton data-index={i} onClick={onDeleteRepoClick}>
                      <DeleteIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }}
              inputProps={{
                'data-index': i
              }}
            />
          ))}
          <footer>
            <IconButton onClick={onAddRepoClick}>
              <AddIcon />
            </IconButton>
          </footer>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </section>
  );
};
