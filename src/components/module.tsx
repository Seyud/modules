import { ReactElement, useState } from 'react'
import * as React from 'react'
import { Grid, Tooltip, Card, CardContent, Typography, Button, Chip, Divider, Box } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import GetAppIcon from '@material-ui/icons/GetApp'
import GitHubIcon from '@material-ui/icons/GitHub'
import LanguageIcon from '@material-ui/icons/Language'
import './module.scss'
import { filesize } from 'filesize'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: '30px 0',
      [theme.breakpoints.down('sm')]: {
        margin: '10px 0'
      }
    },
    header: {
      marginBottom: theme.spacing(4)
    },
    card: {
      borderRadius: 16,
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      marginBottom: theme.spacing(3),
      overflow: 'hidden'
    },
    cardHeader: {
      background: theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
      padding: theme.spacing(2),
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    cardContent: {
      padding: theme.spacing(3)
    },
    sectionTitle: {
      fontWeight: 700,
      fontSize: '1.1rem',
      margin: 0
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.primary.main,
      '&:hover': {
        textDecoration: 'underline'
      }
    },
    chip: {
      margin: theme.spacing(0.5)
    },
    downloadButton: {
      width: '100%',
      marginTop: theme.spacing(1),
      borderRadius: 8,
      textTransform: 'none',
      fontWeight: 600
    },
    releaseCard: {
      marginBottom: theme.spacing(3),
      borderRadius: 16,
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: 'none',
      transition: 'box-shadow 0.2s ease',
      '&:hover': {
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
      }
    },
    releaseHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing(2)
    },
    markdownBody: {
      '& img': {
        maxWidth: '100%',
        borderRadius: 8
      },
      '& pre': {
        borderRadius: 8,
        background: theme.palette.type === 'dark' ? '#1e1e1e' : '#f6f8fa',
        padding: theme.spacing(2)
      }
    }
  })
)

export default function Module({ data }: any): ReactElement {
  const classes = useStyles()
  const [showReleaseNum, setShowReleaseNum] = useState(1)
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <div className={classes.container}>
            {data.githubRepository.childGitHubReadme
              ? (<div
                className="markdown-body"
                dangerouslySetInnerHTML={{
                  __html: data.githubRepository.readmeHTML || (data.githubRepository.childGitHubReadme ? data.githubRepository.childGitHubReadme.childMarkdownRemark.html : '')
                }}
              />)
              : (<div className={classes.plainDocument}>
                {data.githubRepository.summary || data.githubRepository.description}
              </div>)
            }
          </div>
        </Grid>
        <Grid item xs={12} md={3}>
          <div className={classes.container}>
            <Card className={classes.card}>
              <div className={classes.cardHeader}>
                <Typography className={classes.sectionTitle}>Details</Typography>
              </div>
              <CardContent className={classes.cardContent}>
                <Box mb={2}>
                  <Typography variant="subtitle2" color="textSecondary">Module ID</Typography>
                  <Typography variant="body2" style={{ wordBreak: 'break-all' }}>{data.githubRepository.name}</Typography>
                </Box>

                {(data.githubRepository.collaborators?.edges.length) ||
                  (data.githubRepository.additionalAuthors?.length)
                  ? (<Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary">Authors</Typography>
                    <Box display="flex" flexWrap="wrap">
                      {data.githubRepository.collaborators
                        ? data.githubRepository.collaborators.edges.map(({ node: collaborator }: any) => (
                          <Chip
                            key={collaborator.login}
                            label={collaborator.name || collaborator.login}
                            component="a"
                            href={`https://github.com/${collaborator.login as string}`}
                            target="_blank"
                            clickable
                            size="small"
                            className={classes.chip}
                            avatar={<GitHubIcon />}
                          />
                        ))
                        : ''
                      }
                      {data.githubRepository.additionalAuthors
                        ? data.githubRepository.additionalAuthors.map((author: any) => (
                          <Chip
                            key={author.name}
                            label={author.name || author.link}
                            component="a"
                            href={author.link}
                            target="_blank"
                            clickable
                            size="small"
                            className={classes.chip}
                          />
                        ))
                        : ''
                      }
                    </Box>
                  </Box>)
                  : ''
                }

                {data.githubRepository.homepageUrl && (
                  <Box mb={2}>
                    <Button
                      startIcon={<LanguageIcon />}
                      href={data.githubRepository.homepageUrl}
                      target="_blank"
                      fullWidth
                      variant="outlined"
                      size="small"
                    >
                      Website
                    </Button>
                  </Box>
                )}

                {data.githubRepository.sourceUrl && (
                  <Box mb={2}>
                    <Button
                      startIcon={<GitHubIcon />}
                      href={data.githubRepository.sourceUrl}
                      target="_blank"
                      fullWidth
                      variant="outlined"
                      size="small"
                    >
                      Source Code
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {data.githubRepository.releases?.edges.length
              ? (<Card className={classes.card}>
                <div className={classes.cardHeader}>
                  <Typography className={classes.sectionTitle}>Latest Release</Typography>
                </div>
                <CardContent className={classes.cardContent}>
                  <Typography variant="h6" gutterBottom>
                    <a href={data.githubRepository.releases.edges[0].node.url} target="_blank" className={classes.link}>
                      {data.githubRepository.releases.edges[0].node.name}
                    </a>
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Chip
                      label={data.githubRepository.releases.edges[0].node.isPrerelease ? 'Pre-release' : 'Stable'}
                      color={data.githubRepository.releases.edges[0].node.isPrerelease ? 'secondary' : 'primary'}
                      size="small"
                      style={{ marginRight: 8 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {new Date(data.githubRepository.releases.edges[0].node.publishedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.downloadButton}
                    href="#releases"
                  >
                    Download
                  </Button>
                </CardContent>
              </Card>)
              : ''
            }
          </div>
        </Grid>
        {data.githubRepository.releases?.edges.length
          ? (<Grid item xs={12}>
            <div className={classes.header}>
              <Typography variant="h4" component="h1" gutterBottom id="releases" style={{ fontWeight: 700 }}>
                Releases
              </Typography>
              {data.githubRepository.releases.edges.slice(0, showReleaseNum).map(({ node: release }: any) => (
                <Card key={release.name} className={classes.releaseCard}>
                  <CardContent>
                    <div className={classes.releaseHeader}>
                      <Typography variant="h5" component="h2" style={{ fontWeight: 600 }}>
                        <a href={release.url} target="_blank" className={classes.link}>{release.name}</a>
                      </Typography>
                      <Chip
                        label={release.isPrerelease ? 'Pre-release' : 'Stable'}
                        color={release.isPrerelease ? 'secondary' : 'primary'}
                        size="small"
                        variant="outlined"
                      />
                    </div>
                    <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                      Published on {new Date(release.publishedAt).toLocaleString()}
                    </Typography>
                    <Divider style={{ margin: '16px 0' }} />
                    <div
                      className={`markdown-body ${classes.markdownBody}`}
                      dangerouslySetInnerHTML={{
                        __html: release.descriptionHTML
                      }}
                    />
                    {release.releaseAssets?.edges.length
                      ? (
                        <Box mt={3}>
                          <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 600 }}>Downloads</Typography>
                          <Grid container spacing={2}>
                            {release.releaseAssets.edges.map(({ node: asset }: any) => (
                              <Grid item key={asset.name}>
                                <Tooltip title={`${asset.downloadCount as number} downloads in ${filesize(asset.size)}`} placement="top">
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<GetAppIcon />}
                                    href={asset.downloadUrl}
                                    target="_blank"
                                    style={{ borderRadius: 8, textTransform: 'none' }}
                                  >
                                    {asset.name}
                                  </Button>
                                </Tooltip>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>)
                      : ''
                    }
                  </CardContent>
                </Card>
              ))}
              {showReleaseNum !== data.githubRepository.releases.edges.length
                ? (<Box mt={2} textAlign="center">
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      setShowReleaseNum(data.githubRepository.releases.edges.length)
                    }}
                    variant="outlined"
                    color="primary"
                  >Show older versions</Button>
                </Box>)
                : ''
              }
            </div>
          </Grid>)
          : ''
        }
      </Grid>
    </>
  )
}
