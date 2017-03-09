import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Router, Route, IndexRoute, Link, hashHistory, browserHistory } from 'react-router'
import {Tabs, Tab} from 'material-ui/Tabs';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const styles = {
    title: {
        textAlign: 'center',
    },
};

class App extends React.Component{
    render(){
        return(
            <MuiThemeProvider>
                <div>
                    <AppBar
                    style={{textAlign:"center"}}
                    title={<span style={styles.title}>Sam Alghanmi: Full Stack Developer</span>}
                />
                    <Menu
                    changeRoute={this.changeRoute}
                    >
                    </Menu>
                    <CardFrame
                    >
                        {this.props.children}
                     </CardFrame>
                </div>
            </MuiThemeProvider>
        );
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            children: nextProps.children
        });
    }
    changeRoute(tab) {
        hashHistory.push(tab.props['data-route']);
    }
};

const CardFrame = ({children}) => (
        <Card>
        <CardHeader
        />
        <CardText >
        {children}
        </CardText>
        </Card>
);

const Menu = ({changeRoute}) => (
        <Tabs>
        <Tab
        icon={<FontIcon className="material-icons">home</FontIcon>}
        label="Home"
        data-route="/"
        onActive={changeRoute}
        />
        <Tab
        icon={<FontIcon className="material-icons">info</FontIcon>}
        label="About"
        data-route="/about"
        onActive={changeRoute}
        />
        <Tab
        icon={<FontIcon className="material-icons">favorite</FontIcon>}
        label="Portfolio"
        data-route="/portfolio"
        onActive={changeRoute}
        />
        <Tab
        icon={<MapsPersonPin />}
        label="Contact"
        data-route="/contact"
        onActive={changeRoute}
        />
        </Tabs>
);

const Footer = () => (
    <footer>
    </footer>
);

const Home = () => (
        <article>
            <h3>Welcome to my personal Site.</h3> 
            <h3>My name is Sam Alghanmi. I am a full-stack developer. My main language is Javascript.</h3>
        </article>
);

const About = () => (
        <article>
            <h3>
            I am full stack developer with 7 years of professional experience. My main stack is composed of JavaScript: React, Angularjs, Redux, Mobx, RxJS, Webpack are some of what I know on the front-end. On the back-end, I am familiar with Node: Express, PostgreSQL on the back-end. I have been focusing my efforts in the last two years on working with Hybrid Mobile apps in React Native. 
            I have worked in most settings of software development. I have run my own agency, worked at an agency, in-house on a product team, and freelanced. My diverse background empowers me to bring a comprehensive view into any technical issue I am faced with.
            </h3>
        </article>
);

const Portfolio = () => (
    <article>
        <h3>
        Portfolio
        </h3>
    </article>
);

const Contact = () => (
    <article>
        <h3>
        Contact
        </h3>
    </article>
);

ReactDOM.render(
        <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="about" component={About} />
            <Route path="portfolio" component={Portfolio} />
            <Route path="contact" component={Contact} />
        </Route>
        </Router>,
        document.getElementById('app')
        );
