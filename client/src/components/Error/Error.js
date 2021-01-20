import "./Error.scss";

const Error = ({ msg }) => {
    return (
        <div className="error">
            <div className="header">
                <div className="title">
                    TYPE<span>DASH</span>
                </div>
            </div>
            <div className="msg">{msg}</div>
        </div>
    );
};

export default Error;
