import "./Error.scss";

const Error = ({ msg, goBack }) => {
    return (
        <div className="error-wrapper">
            <div className="error">
                <div className="header">
                    <div className="title">
                        TYPE<span>DASH</span>
                    </div>
                </div>
                <div className="msg">{msg}</div>
                {goBack && <button onClick={goBack}>OK</button>}
            </div>
        </div>
    );
};

export default Error;
