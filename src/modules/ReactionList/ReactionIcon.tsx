import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useClasses = makeStyles(theme => createStyles({
  root: {
    paddingRight: theme.spacing(2),
    fontSize: theme.spacing(3),
    textAlign: 'right'
  }
}));

type Props = {
  content: string;
}

export const ReactionIcon = ({ content }: Props) => {
  const classes = useClasses();

  return (
    <div className={classes.root}>
      {(() => {
        switch (content) {
          case '+1':
            return '👍';
          case '-1':
            return '👎';
          case 'laugh':
            return '😄';
          case 'confused':
            return '😕';
          case 'heart':
            return '❤️';
          case 'hooray':
            return '🎉';
          case 'rocket':
            return '🚀';
          case 'eyes':
            return '👀';
          default:
            return null;
        }
      })()}
    </div>
  )
};
