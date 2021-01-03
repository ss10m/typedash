// Libraries & utils
import React from "react";
import { Route, Switch } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import { getSession } from "store/actions";

// Components
import Navbar from "./Navbar/Navbar";
import Login from "./Login/Login";
import Racer from "./Racer/Racer";
import WindowSize from "./WindowSize/WindowSize";

// SCSS
import "./App.scss";

class App extends React.Component {
    componentDidMount() {
        this.props.getSession();
    }

    render() {
        let { session } = this.props;
        if (!session.isLoaded) return <div>Loading...</div>;

        return (
            <>
                <WindowSize />
                <div className="app">
                    <div className="main">
                        <div className="sides">
                            <Navbar />
                            <Switch>
                                <Route exact path="/" render={() => <h1>main</h1>}></Route>
                                <Route exact path="/racer" render={() => <Racer />} />
                                <Route exact path="/login" render={() => <Login />} />
                                <Route render={() => <h1>404</h1>} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.session,
    };
};

const mapDispatchToProps = (dispatch) => ({
    getSession: () => {
        dispatch(getSession());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
