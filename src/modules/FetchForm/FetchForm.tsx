import React, { useState, useCallback } from 'react';
import { DatePicker } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { makeStyles, createStyles } from '@material-ui/core';

const startDate = new Date();
startDate.setHours(0);
startDate.setMinutes(0);
startDate.setSeconds(0);
startDate.setDate(startDate.getDate() - 1);

const useStyles = makeStyles(theme => createStyles({
  root: {
    display: 'flex',
    padding: theme.spacing(2),
    alignItems: 'center',
    '& > * + *': {
      marginLeft: theme.spacing(1)
    }
  }
}));

type Props = {
  onSubmit: (since: Date) => void;
};

export const FetchForm = ({ onSubmit }: Props) => {
  const [since, setSince] = useState<Date | null>(startDate);

  const onButtonClick = useCallback(() => {
    if (!since) return;
    onSubmit(since);
  }, [onSubmit, since]);

  const classes = useStyles();

  return (
    <Paper className={classes.root} component="section">
      <DatePicker label="Since" value={since} onChange={setSince} />
      <Button type="submit" variant="contained" color="primary" onClick={onButtonClick}>
        Submit
      </Button>
    </Paper>
  )
};
