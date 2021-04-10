// Libraries & utils
import { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Select from "react-select";

// Socket API
import SocketAPI from "core/SocketClient";

// Icons
import { FaSortAmountDown, FaSortAmountDownAlt } from "react-icons/fa";

// Components
import ResultsModal from "components/ResultsModal/ResultsModal";

// Constants
import { handleResponse, roundToFixed } from "helpers";

// SCSS
import "./Quotes.scss";

const Quotes = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [quotes, setQuotes] = useState([]);
    const [resultsModal, setResultsModal] = useState(false);
    const history = useHistory();

    useEffect(() => {
        fetch("/api/quote")
            .then(handleResponse)
            .then((data) => {
                setQuotes(data.quotes);
                setIsLoaded(true);
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

    const createRoom = useCallback(
        (quoteId) => {
            if (isCreating) return;
            setIsCreating(true);
            SocketAPI.createRoom(quoteId);
        },
        [isCreating]
    );

    const closeModal = useCallback(() => {
        setResultsModal(null);
    }, []);

    if (!isLoaded) return null;

    return (
        <div className="quotes">
            <div className="quotes-header">
                <p>QUOTES</p>
                <Sort setQuotes={setQuotes} />
            </div>
            <div className="list">
                {quotes.map((quote) => (
                    <Quote
                        key={quote.id}
                        quote={quote}
                        createRoom={createRoom}
                        setResultsModal={setResultsModal}
                    />
                ))}
            </div>
            {resultsModal && <ResultsModal quoteId={resultsModal} closeModal={closeModal} />}
        </div>
    );
};

const Sort = ({ setQuotes }) => {
    const [sort, setSort] = useState({
        selected: { value: "id", label: "QUOTE ID" },
        order: "asc",
    });

    const selectOptions = [
        { value: "id", label: "QUOTE ID" },
        { value: "count", label: "PLAY COUNT" },
        { value: "avg_wpm", label: "AVERAGE WPM" },
        { value: "avg_acc", label: "AVERAGE ACCURACY" },
    ];

    const defaultSort = {
        id: "asc",
        count: "desc",
        avg_wpm: "desc",
        avg_acc: "desc",
    };

    useEffect(() => {
        const { selected, order } = sort;
        const sortFunction = {
            asc: (a, b) => a[selected.value] - b[selected.value],
            desc: (a, b) => b[selected.value] - a[selected.value],
        };
        setQuotes((current) => [...current].sort(sortFunction[order]));
    }, [sort, setQuotes]);

    const setSelected = (selected) => {
        if (selected.value === sort.selected.value) return;
        setSort({
            selected,
            order: defaultSort[selected.value],
        });
    };

    const toggleSortOrder = () => {
        setSort((current) => ({
            ...current,
            order: current.order === "asc" ? "desc" : "asc",
        }));
    };

    const customStyles = useMemo(
        () => ({
            control: (base, state) => ({
                ...base,
                background: "#162029",
                borderRadius: state.isFocused ? "3px 3px 0 0" : "3px",
                borderColor: "#3a5068",
                boxShadow: state.isFocused ? null : null,
                "&:hover": {
                    borderColor: "#56779a",
                    cursor: "pointer",
                },
            }),
            menu: (base) => ({
                ...base,
                marginTop: 0,
            }),
            menuList: (base) => ({
                ...base,
                padding: "10px 0",
                background: "#2c3f54",
                border: "1px solid #56779a",
                borderTop: "none",
                color: "whitesmoke",
            }),
            singleValue: (provided) => ({
                ...provided,
                color: "whitesmoke",
            }),
            option: (styles, state) => ({
                ...styles,
                cursor: "pointer",
                background: state.isSelected ? "#3a5068" : "#2c3f54",
                "&:hover": {
                    background: "#56779a",
                },
                "&:active": {
                    background: "#3e9dff",
                },
            }),
        }),
        []
    );

    return (
        <div className="sorting">
            <div className="select-graph">
                <Select
                    value={sort.selected}
                    options={selectOptions}
                    autosize={true}
                    styles={customStyles}
                    onChange={setSelected}
                    isDisabled={false}
                />
            </div>
            <div className="toggle" onClick={toggleSortOrder}>
                {sort.order === "asc" ? <FaSortAmountDownAlt /> : <FaSortAmountDown />}
            </div>
        </div>
    );
};

const Quote = ({ quote, createRoom, setResultsModal }) => {
    return (
        <div className="quote">
            <div className="quote-header">
                <p>{`#${quote.id}`}</p>
                <div>
                    <div className="button" onClick={() => createRoom(quote.id)}>
                        PLAY
                    </div>
                    <div className="button" onClick={() => setResultsModal(quote.id)}>
                        RESULTS
                    </div>
                </div>
            </div>
            <div className="words">{quote.text}</div>
            <div className="quote-stats">
                <div>
                    <div className="item">
                        <div className="header">PLAYED</div>
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
