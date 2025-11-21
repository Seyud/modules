import * as React from 'react'
import {
  Container,
  createTheme,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MuiThemeProvider,
  useMediaQuery
} from '@material-ui/core'
import { blue } from '@material-ui/core/colors'
import { createStyles, alpha, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import AppsIcon from '@material-ui/icons/Apps'
import PublishIcon from '@material-ui/icons/Publish'
import './styles.styl'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { useEffect, useState } from 'react'
import { useFlexSearch } from 'react-use-flexsearch'
import * as flexsearchConfig from './flexsearch-config'
import { useDebounce } from './debounce'
import SearchResultCard from './components/search-result-card'
import FlexSearch from 'flexsearch'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    appBar: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      boxShadow: 'none',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      color: theme.palette.text.primary,
      [theme.breakpoints.down('xs')]: {
        background: theme.palette.background.paper
      }
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block'
      }
    },
    h1: {
      textDecoration: 'none',
      color: 'inherit',
      fontWeight: 700,
      letterSpacing: '-0.02em'
    },
    search: {
      position: 'relative',
      borderRadius: 16,
      backgroundColor: alpha(theme.palette.common.black, 0.05),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.08)
      },
      marginLeft: 0,
      marginRight: '12px',
      width: '100%',
      transition: 'all 0.2s ease',
      border: '1px solid transparent',
      '&:focus-within': {
        backgroundColor: alpha(theme.palette.common.white, 1),
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: `1px solid ${theme.palette.primary.main}`
      },
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto'
      }
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.text.secondary
    },
    inputRoot: {
      color: 'inherit',
      width: '100%'
    },
    inputInput: {
      padding: theme.spacing(1.5, 1, 1.5, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '16ch',
        '&:focus': {
          width: '24ch'
        }
      }
    },
    footer: {
      padding: theme.spacing(3, 2),
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      color: theme.palette.text.secondary
    },
    list: {
      width: 250
    },
    searchResult: {
      position: 'absolute',
      right: 0,
      top: 'calc(100% + 12px)',
      zIndex: 10,
      borderRadius: 12,
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      overflow: 'hidden',
      [theme.breakpoints.down('xs')]: {
        right: -28,
        width: '100vw'
      }
    },
    hide: {
      display: 'none'
    }
  })
)

let previousLoaded = false

const index = FlexSearch.create(flexsearchConfig)

function Layout (props: { children: React.ReactNode }): React.ReactElement {
  const classes = useStyles()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isSearchFocused, _setIsSearchFocused] = useState(false)
  const searchRef = React.createRef<HTMLInputElement>()
  const setIsSearchFocused = (focused: boolean): void => {
    _setIsSearchFocused(focused)
    if (focused) {
      searchRef.current?.focus()
    } else {
      searchRef.current?.blur()
    }
  }
  useEffect(() => {
    const blur = (): void => setIsSearchFocused(false)
    window.addEventListener('click', blur)
    return () => {
      window.removeEventListener('click', blur)
    }
  })
  const debouncedSearchKeyword = useDebounce(searchKeyword, 300)
  const { localSearchRepositories } = useStaticQuery(graphql`
{
  localSearchRepositories {
    index
    store
  }
}
`)
  useEffect(() => {
    index.import(localSearchRepositories.index)
  }, [localSearchRepositories.index])
  const searchResult = useFlexSearch(
    debouncedSearchKeyword,
    index,
    localSearchRepositories.store,
    100
  ).sort((a, b) => {
    const iq = (x: string) => {
      if (!x) return false
      return x.toLowerCase().includes(debouncedSearchKeyword.toLowerCase())
    }
    if (iq(a.name) != iq(b.name)) return iq(b.name) - iq(a.name)
    if (iq(a.description) != iq(b.description)) return iq(b.description) - iq(a.description)
    if (iq(a.summary) != iq(b.summary)) return iq(b.summary) - iq(a.summary)
    return 1
  }).slice(0, 6)
  const toggleDrawer = (): void => {
    setIsDrawerOpen(!isDrawerOpen)
  }
  return (
    <div className={classes.root}>
      <AppBar position='sticky' className={classes.appBar} color="default">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.title}>
            <Typography variant="h6" noWrap className={classes.h1}
                        component={Link} to={'/'}
            >
              KernelSU Modules Repository
            </Typography>
          </div>
          <div
            className={classes.search}
            onClick={(e) => { setIsSearchFocused(true); e.stopPropagation() }}
          >
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputRef={searchRef}
              inputProps={{ 'aria-label': 'search' }}
              value={searchKeyword}
              onChange={(e) => { setSearchKeyword(e.target.value) }}
            />
            <SearchResultCard
              className={`${classes.searchResult} ${isSearchFocused ? '' : classes.hide}`}
              searchKeyword={debouncedSearchKeyword}
              searchResult={searchResult}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer open={isDrawerOpen} onClose={toggleDrawer}>
        <List className={classes.list}>
          <ListItem button component={Link} to={'/'}>
            <ListItemIcon><AppsIcon /></ListItemIcon>
            <ListItemText primary="Browse" />
          </ListItem>
          <ListItem button component={Link} to={'/submission'}>
            <ListItemIcon><PublishIcon /></ListItemIcon>
            <ListItemText primary="Submission" />
          </ListItem>
        </List>
      </Drawer>
      <Container maxWidth="md">
        <>{props.children}</>
      </Container>
      <div className={classes.footer}>
        &#169; 2021 - {new Date().getFullYear()} Official KernelSU Modules Repository
      </div>
      <div className={classes.footer}>
        <a href="https://lsposed.org/privacy">Privacy Policy</a>
      </div>
    </div>
  )
}

export const Splash = React.memo(() => (
  <>
    <div className="splash" />
    <script dangerouslySetInnerHTML={{
      __html: '(function(){var i=-1,t=["__(:з 」∠)__","___(:з 」∠)_","____(:з 」∠)","____(:з」 ∠)","___(:з 」∠)_","___(:з」 ∠)_","__(:з 」∠)__","__(:з」 ∠)__","_(:з 」∠)___"];function f(){var d=document.querySelector(".splash");if(!d)return;i=i+1>=t.length?0:i+1;d.innerText=t[i];setTimeout(f,i>2&&i<8?250:1000)}f()})()'
    }} />
  </>
))

export default function LayoutWithTheme (props: { children: React.ReactNode }): React.ReactElement {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
    noSsr: true
  })
  const theme = React.useMemo(
    () => createTheme({
      palette: {
        type: prefersDarkMode ? 'dark' : 'light',
        primary: { main: prefersDarkMode ? '#90caf9' : '#1976d2' },
        secondary: { main: prefersDarkMode ? '#f48fb1' : '#d81b60' },
        background: {
          default: prefersDarkMode ? '#0f1012' : '#f5f7fa',
          paper: prefersDarkMode ? '#1e1e24' : '#ffffff'
        }
      },
      shape: {
        borderRadius: 12
      },
      typography: {
        fontFamily: [
          'Inter',
          'Roboto',
          'FZ SC',
          'sans-serif'
        ].join(','),
        h5: {
          fontWeight: 600
        },
        h6: {
          fontWeight: 600
        }
      },
      overrides: {
        MuiAppBar: {
          colorDefault: {
            backgroundColor: prefersDarkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'
          }
        }
      }
    }),
    [prefersDarkMode]
  )
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    setLoaded(true)
  }, [])
  previousLoaded = previousLoaded || loaded
  return (
    <MuiThemeProvider theme={theme}>
      {!previousLoaded && <Splash />}
      <CssBaseline />
      <div className={`fade ${previousLoaded ? '' : 'ssr'}`}>
        <Layout {...props} />
      </div>
    </MuiThemeProvider>
  )
}
