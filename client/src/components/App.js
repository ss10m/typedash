// Libraries & utils
import React from "react";
import { Route, Switch } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import { getSession } from "store/actions";

// Components
import Racer from "./racer/Racer";
import Login from "./login/Login";

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
            <div className="app">
                <div className="main">
                    <Switch>
                        <Route exact path="/" render={() => <h1>main</h1>}></Route>
                        <Route exact path="/racer" render={() => <Racer />} />
                        <Route exact path="/login" render={() => <Login />} />
                        <Route render={() => <h1>404</h1>} />
                    </Switch>
                </div>
            </div>
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
