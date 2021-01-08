// Libraries
import React from "react";
import { connect } from "react-redux";

// Components
import Rooms from "./Rooms";

// Redux Actions
import { joinRoom, createRoom, refreshRooms } from "store/actions";

// Helpers
import { isEmpty } from "helpers";

class RoomsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { filter: "", refreshDisabled: false };
    }

    handleChange = (event) => {
        this.setState({ filter: event.target.value });
    };

    clearFilter = () => {
        this.setState({ filter: "" });
    };

    getRooms = () => {
        let { rooms } = this.props;
        let { filter } = this.state;
        if (!filter) return rooms;

        const filtered = filter.toLowerCase().trim();

        return rooms.filter((room) => {
            const lowerName = room.name.toLowerCase();
            if (lowerName.includes(filtered)) return true;
            if (lowerName.includes("room " + filtered)) return true;
            return false;
        });
    };

    refreshRooms = () => {
        if (this.state.refreshDisabled) return;
        this.props.refreshRooms();
        this.setState({ refreshDisabled: true });
        setTimeout(() => this.setState({ refreshDisabled: false }), 800);
    };

    createRoom = () => {
        this.props.createRoom();
    };

    joinRoom = (room) => {
        this.props.joinRoom(room);
    };

    render() {
        let { filter, refreshDisabled } = this.state;
        let rooms = this.getRooms();

        return (
            <Rooms
                rooms={rooms}
                filter={filter}
                handleChange={this.handleChange}
                clearFilter={this.clearFilter}
                refreshRooms={this.refreshRooms}
                createRoom={this.createRoom}
                joinRoom={this.joinRoom}
                isEmpty={isEmpty}
                refreshDisabled={refreshDisabled}
                windowSize={this.props.windowSize}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        rooms: state.rooms,
        windowSize: state.windowSize,
    };
};

const mapDispatchToProps = (dispatch) => ({
    createRoom: () => {
        dispatch(createRoom());
    },
    joinRoom: (room) => {
        dispatch(joinRoom(room));
    },
    refreshRooms: () => {
        dispatch(refreshRooms());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomsContainer);
