import React, { useCallback } from 'react';
import { User } from '../../hooks/useFetch/useFetch';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

type Props = {
  users: User[] | null;
  onChange: (user: User | null) => void;
};

const useStyles = makeStyles(theme => createStyles({
  root: {
    padding: theme.spacing(2),
  }
}));


export const Filter = ({ users, onChange }: Props) => {

  const classes = useStyles();

  const onSelectChange = useCallback((event: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
  }>) =>{
    const login = event.target.value;
    const user = users?.find(user => user.login === login) ?? null;
    onChange(user);
  }, [users, onChange]);

  if (!users) return null;

  return (
    <Paper className={classes.root} component="section">
      <Select label="Filter" onChange={onSelectChange}>
        <MenuItem value="">
          <Typography variant="inherit">None</Typography>
        </MenuItem>
        {users.map(user => (
          <MenuItem value={user.login} key={user.id}>
            <ListItemAvatar>
              <Avatar src={user.avatar_url} />
            </ListItemAvatar>
            <Typography variant="inherit">
              {user.login}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </Paper>
  );
};
