import React, { useState, useEffect, useCallback } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import TextField from '@material-ui/core/TextField';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => createStyles({
  root: {},
  details: {
    flexDirection: 'column',
    '& > * + *': {
      marginTop: theme.spacing(1)
    }
  }
}));

type Props = {
  onPersonalAccessTokenChange: (personalAccessToken: string) => void;
  onBaseUrlChange: (baseUrl: string) => void;
};

export const ConfigForm = ({ onPersonalAccessTokenChange, onBaseUrlChange }: Props) => {
  const [personalAccessToken, setPersonalAccessToken] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.github.com');

  const onPersonalAccessTokenTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const token = e.currentTarget.value;
    setPersonalAccessToken(token);
    localStorage.setItem('personalAccessToken', token);
  }, []);

  const onBaseUrlTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const token = e.currentTarget.value;
    setBaseUrl(token);
    localStorage.setItem('baseUrl', token);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('personalAccessToken');
    if (storedToken) {
      setPersonalAccessToken(storedToken);
    }
    const storedBaseUrl = localStorage.getItem('baseUrl');
    if (storedBaseUrl) {
      setBaseUrl(storedBaseUrl);
    }
  }, []);

  useEffect(() => {
    onPersonalAccessTokenChange(personalAccessToken);
  }, [personalAccessToken]);

  useEffect(() => {
    onBaseUrlChange(baseUrl);
  }, [baseUrl]);

  const classes = useStyles();

  return (
    <section className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary>
          <Typography variant="h6" component="h1">Config</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <TextField label="Personal Access Token" onChange={onPersonalAccessTokenTextChange} value={personalAccessToken} />
          <TextField label="Github REST API Base URL" onChange={onBaseUrlTextChange} value={baseUrl} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </section>
  )
};
