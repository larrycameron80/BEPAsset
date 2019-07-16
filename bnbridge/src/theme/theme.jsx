export const colors = {
  white: "#fff",
  black: '#000',
  yellow: "#efc660",
  gray: "#e1e1e1",
  lightGray: "#fafafa",
  lightBlack: "#6a6a6a",
  darkBlack: "#141414",
  red: "#f00",
  blue: "#00f",
  green: "rgb(0, 192, 135)"
};

const bnbridgeTheme =  {
  typography: {
    fontFamily: ['Lato', 'Roboto', 'Open Sans', 'sans-serif'].join(","),
    lineHeight: 1.45,
    useNextVariants: true,
    h6: {
      fontFamily: ['Source Sans Pro','sans-serif'].join(","),
      fontSize: '0.8rem',
      color: colors.darkBlack,
      fontWeight: 600,
      marginBottom: '.5rem'
    }
  },
  type: 'light',
  overrides: {
    MuiInputBase: {
      root: {
        fontSize: '13px',
        background: colors.lightGray
      }
    },
    MuiOutlinedInput: {
      input: {
        padding: '14px'
      }
    },
    MuiPrivateNotchedOutline: {
      root: {
        borderRadius: '0px'
      }
    },
    MuiButton: {
      label: {
        fontSize: '0.7rem'
      }
    },
    MuiTab: {
      label: {
        fontFamily: ['Source Sans Pro','sans-serif'].join(","),
        paddingTop: "1rem",
        paddingBottom: "1rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontWeight: 700,
        "&$selected": {
          color: colors.yellow
        },
      },
      root: {
        borderBottom: "1px solid #dee2e6!important"
      }

    },
    MuiDialog: {
      paperFullWidth: {
        width: '520px'
      }
    }
  },
  palette: {
    primary: {
      main: colors.yellow
    },
    secondary: {
      main: colors.lightBlack
    },
    background:{
      paper: colors.white,
      default: colors.white
    },
    text: {
      primary: colors.lightBlack,
      secondary: colors.yellow
    }
  }
};

export default bnbridgeTheme;
