// Libraries & utils
import { useState, useEffect } from "react";

// Constants
import { handleResponse, roundToFixed } from "helpers";

// SCSS
import "./Quotes.scss";

const Quotes = () => {
    const [quotes, setQuotes] = useState([]);

    useEffect(() => {
        fetch("/api/quotes")
            .then(handleResponse)
            .then((data) => {
                setQuotes(data.quotes);
            })
            .catch(() => {});
    }, []);

    return (
        <div className="quotes">
            <div className="quotes-header">QUOTES</div>
            <div className="list">
                {quotes.map((quote) => (
                    <Quote key={quote.id} quote={quote} />
                ))}
            </div>
        </div>
    );
};

const Quote = ({ quote }) => {
    return (
        <div className="quote">
            <div className="quote-header">
                <p>{`#${quote.id}`}</p>
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
