import React from 'react';
import { Reaction } from '../../hooks/useFetch/useFetch';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Markdown from 'markdown-to-jsx';
import Divider from '@material-ui/core/Divider';
import { ReactionIcon } from './ReactionIcon';

type Props = {
  reactions: Reaction[] | null;
}

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      width: '100%'
    },
    item: {
      alignItems: 'flex-start'
    },
    itemLeft: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    itemText: {
    },
    pull: {
      display: 'flex',
      alignItems: 'center',
      '& > * + *': {
        marginLeft: theme.spacing(1)
      }
    },
    pullAvatar: {
      width: theme.spacing(2),
      height: theme.spacing(2)
    },
    comment: {
      display: 'flex',
      marginTop: theme.spacing(1),
      '& > .MuiAvatar-root': {
        marginRight: theme.spacing(1)
      }
    },
    body: {
      flexGrow: 1,
      padding: theme.spacing(1),
      '& pre': {
        whiteSpace: 'pre-wrap'
      }
    }
  })
);

export const ReactionList = ({ reactions }: Props) => {
  if (!reactions) return null;

  const classes = useStyles();
  console.log(reactions);

  return (
    <Paper className={classes.root}>
      <List>
        {reactions.map((reaction, i) => (
          <>
            {i ? <Divider variant="inset" component="li" key={i} /> : null}
            <ListItem className={classes.item} key={reaction.id}>
              <div className={classes.itemLeft}>
                <ListItemAvatar>
                  <Avatar alt={reaction.user.login} src={reaction.user.avatar_url} />
                </ListItemAvatar>
                <ReactionIcon content={reaction.content} />
              </div>
              <ListItemText className={classes.itemText}>
                <Link className={classes.pull} href={reaction.comment.html_url} target="_blank">
                  <Avatar className={classes.pullAvatar} alt={reaction.pullRequest.user.login} src={reaction.pullRequest.user.avatar_url} />
                  <Typography>#{reaction.pullRequest.number}</Typography>
                  <Typography>{reaction.pullRequest.title}</Typography>
                </Link>
                <div className={classes.comment}>
                  <Avatar alt={reaction.comment.user.login} src={reaction.comment.user.avatar_url} />
                  <Paper className={classes.body} variant="outlined">
                    <Markdown>
                      {reaction.comment.body}
                    </Markdown>
                  </Paper>
                </div>
              </ListItemText>
            </ListItem>
          </>
        ))}
      </List>
    </Paper>
  )
};
