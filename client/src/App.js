import React from "react";

class App extends React.Component {
    componentDidMount() {
        fetch("/api")
            .then((response) => response.json())
            .then((data) => console.log(data));
    }

    render() {
        return <div className="App">BOILERPLATE</div>;
    }
}

export default App;
