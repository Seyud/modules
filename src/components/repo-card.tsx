import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { Link } from 'gatsby'

export interface RepoCardProps {
  name: string
  title: string
  summary: string
  url: string
  sourceUrl: string
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 10,
    height: 220,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    borderRadius: 16,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: `1px solid ${theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}`,
    background: theme.palette.background.paper,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
    }
  },
  actionArea: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflow: 'hidden',
    padding: theme.spacing(1)
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflow: 'hidden',
    width: '100%'
  },
  title: {
    fontWeight: 700,
    fontSize: '1.1rem',
    marginBottom: theme.spacing(1),
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden'
  },
  body: {
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': 3,
    '-webkit-box-orient': 'vertical',
    lineHeight: 1.6,
    opacity: 0.8
  },
  actions: {
    padding: theme.spacing(1, 2, 2),
    justifyContent: 'flex-end'
  }
}))

export default function RepoCard(props: RepoCardProps): React.ReactElement {
  const classes = useStyles()
  return (
    <Card className={classes.root}>
      <CardActionArea className={classes.actionArea}
        component={Link} to={`/module/${props.name}`}>
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p"
            className={classes.body}
          >
            {props.summary}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {props.url
          ? (<Button size="small" color="secondary"
            href={props.url} target={'_blank'}
          >
            Website
          </Button>)
          : ''
        }
        {props.sourceUrl
          ? (<Button size="small" color="secondary"
            href={props.sourceUrl} target={'_blank'}
          >
            Source
          </Button>)
          : ''
        }
      </CardActions>
    </Card>
  )
}
