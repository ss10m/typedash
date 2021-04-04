// Libraries & utils
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

// Socket API
import SocketAPI from "core/SocketClient";

// Constants
import { handleResponse, roundToFixed } from "helpers";

// SCSS
import "./Quotes.scss";

const Quotes = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [quotes, setQuotes] = useState([]);
    const history = useHistory();

    useEffect(() => {
        fetch("/api/quotes")
            .then(handleResponse)
            .then((data) => {
                setQuotes(data.quotes);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const socket = SocketAPI.getSocket();
        socket.on("room-created", (roomId) => {
            history.push(`/room/${roomId}`);
        });

        return () => {
            socket.off("room-created");
        };
    }, [history]);

    const createRoom = (quoteId) => {
        if (isCreating) return;
        setIsCreating(true);
        SocketAPI.createRoom(quoteId);
    };

    return (
        <div className="quotes">
            <div className="quotes-header">QUOTES</div>
            <div className="list">
                {quotes.map((quote) => (
                    <Quote key={quote.id} quote={quote} createRoom={createRoom} />
                ))}
            </div>
        </div>
    );
};

const Quote = ({ quote, createRoom }) => {
    return (
        <div className="quote">
            <div className="quote-header">
                <p>{`#${quote.id}`}</p>
                <div className="button" onClick={() => createRoom(quote.id)}>
                    PLAY
                </div>
            </div>
            <div className="words">{quote.text}</div>
            <div className="quote-stats">
                <div>
                    <div className="item">
                        <div className="header">COUNT</div>
                        <div className="value">{quote.count}</div>
                    </div>

                    <div className="divider" />

                    <div className="item">
                        <div className="header">AVG WPM</div>
                        <div className="value">{roundToFixed(quote.avg_wpm)}</div>
                    </div>

                    <div className="divider" />

                    <div className="item">
                        <div className="header">AVG ACC</div>
                        <div className="value">{`${roundToFixed(quote.avg_acc)}%`}</div>
                    </div>
                </div>
                <div>
                    <div className="item">
                        <div className="header">AUTHOR</div>
                        <div className="value">{quote.author}</div>
                    </div>
                    <div className="divider" />
                    <div className="item">
                        <div className="header">BOOK</div>
                        <div className="value">{quote.source}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quotes;
