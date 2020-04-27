import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
    secondary: pink
  }
});
