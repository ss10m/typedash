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

// Styles
import * as Styles from "./styles";

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
        <Styles.Quotes>
            <Styles.Header>
                <p>QUOTES</p>
                <Sort setQuotes={setQuotes} />
            </Styles.Header>
            <div>
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
        </Styles.Quotes>
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
        <div>
            <Styles.SortSelect>
                <Select
                    value={sort.selected}
                    options={selectOptions}
                    autosize={true}
                    styles={customStyles}
                    onChange={setSelected}
                    isDisabled={false}
                />
            </Styles.SortSelect>
            <Styles.OrderToggle onClick={toggleSortOrder}>
                {sort.order === "asc" ? <FaSortAmountDownAlt /> : <FaSortAmountDown />}
            </Styles.OrderToggle>
        </div>
    );
};

const Quote = ({ quote, createRoom, setResultsModal }) => {
    return (
        <Styles.Quote>
            <Styles.QuoteHeader>
                <p>{`#${quote.id}`}</p>
                <div>
                    <Styles.Button onClick={() => createRoom(quote.id)}>PLAY</Styles.Button>
                    <Styles.Button
                        className="button"
                        onClick={() => setResultsModal(quote.id)}
                    >
                        RESULTS
                    </Styles.Button>
                </div>
            </Styles.QuoteHeader>
            <Styles.Words>{quote.text}</Styles.Words>
            <Styles.Stats>
                <div>
                    <Styles.Stat>
                        <p>PLAYED</p>
                        <p>{quote.count}</p>
                    </Styles.Stat>
                    <Styles.Divider />
                    <Styles.Stat>
                        <p>AVG WPM</p>
                        <p>{roundToFixed(quote.avg_wpm)}</p>
                    </Styles.Stat>
                    <Styles.Divider />
                    <Styles.Stat>
                        <p>AVG ACC</p>
                        <p>{`${roundToFixed(quote.avg_acc)}%`}</p>
                    </Styles.Stat>
                </div>
                <div>
                    <Styles.Stat>
                        <p>AUTHOR</p>
                        <p>{quote.author}</p>
                    </Styles.Stat>
                    <Styles.Divider />
                    <Styles.Stat>
                        <p>BOOK</p>
                        <p>{quote.source}</p>
                    </Styles.Stat>
                </div>
            </Styles.Stats>
        </Styles.Quote>
    );
};

export default Quotes;
