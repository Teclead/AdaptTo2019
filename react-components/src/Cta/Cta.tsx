import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


export default class Cta extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {};

    let i = 1;
    setInterval(() => {
      this.setState({ timer: i })
      i++;
    }, 1000)
  }

  get structuredProps() {
    const liElements = Object.keys(this.props).map(key => <li>{key}: {this.props[key]}</li>)
    return <ul>
      {liElements}
    </ul>
  }


  render() {
    return (
      <div style={{ padding: '10px', width: '600px', margin: 'auto' }}>
        <Card>
          <CardActionArea>
            <CardMedia
              style={{ height: '300px' }}
              image={this.props.img}
              title="Title..."
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                This a very simple React Test with Material UI and the Dialog Generator
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                This are all Author props from the dialog:
                <br />
                {this.structuredProps}
                <br />
                We also have an active state: {this.state && this.state.timer}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary">
              Share
          </Button>
            <a href="https://www.teclead.de">
              <Button size="small" color="primary">
                @Teclead
            </Button>
            </a>
          </CardActions>
        </Card>
      </div>
    );
  }
}


