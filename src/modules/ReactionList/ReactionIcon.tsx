import React from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';

type Props = {
  content: string;
}

export const ReactionIcon = ({ content }: Props) => {
  switch (content) {
    case '+1':
      return <ListItemIcon>👍</ListItemIcon>;
    case '-1':
      return <ListItemIcon>👎</ListItemIcon>;
    case 'laugh':
      return <ListItemIcon>😄</ListItemIcon>;
    case 'confused':
      return <ListItemIcon>😕</ListItemIcon>;
    case 'heart':
      return <ListItemIcon>❤️</ListItemIcon>;
    case 'hooray':
      return <ListItemIcon>🎉</ListItemIcon>;
    case 'rocket':
      return <ListItemIcon>🚀</ListItemIcon>;
    case 'eyes':
      return <ListItemIcon>👀</ListItemIcon>;
    default:
      return null;
  }
};
