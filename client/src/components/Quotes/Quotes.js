// Libraries & utils
import { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Select from "react-select";

// Socket API
import SocketAPI from "core/SocketClient";

// Icons
import { FaSortAmountDown, FaSortAmountDownAlt } from "react-icons/fa";

// Components
import ResultsModal from "./ResultsModal/ResultsModal";

// Constants
import { handleResponse, roundToFixed } from "helpers";

// Styles
import * as Styled from "./styles";

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
        <>
            <Styled.Quotes>
                <Styled.Header>
                    <p>QUOTES</p>
                    <Sort setQuotes={setQuotes} />
                </Styled.Header>
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
            </Styled.Quotes>
            {resultsModal && <ResultsModal quoteId={resultsModal} closeModal={closeModal} />}
        </>
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
            <Styled.SortSelect>
                <Select
                    value={sort.selected}
                    options={selectOptions}
                    autosize={true}
                    styles={customStyles}
                    onChange={setSelected}
                    isDisabled={false}
                />
            </Styled.SortSelect>
            <Styled.OrderToggle onClick={toggleSortOrder}>
                {sort.order === "asc" ? <FaSortAmountDownAlt /> : <FaSortAmountDown />}
            </Styled.OrderToggle>
        </div>
    );
};

const Quote = ({ quote, createRoom, setResultsModal }) => {
    return (
        <Styled.Quote>
            <Styled.QuoteHeader>
                <p>{`#${quote.id}`}</p>
                <div>
                    <Styled.Button onClick={() => createRoom(quote.id)}>PLAY</Styled.Button>
                    <Styled.Button
                        className="button"
                        onClick={() => setResultsModal(quote.id)}
                    >
                        RESULTS
                    </Styled.Button>
                </div>
            </Styled.QuoteHeader>
            <Styled.Words>{quote.text}</Styled.Words>
            <Styled.Stats>
                <div>
                    <Styled.Stat>
                        <p>PLAYED</p>
                        <p>{quote.count}</p>
                    </Styled.Stat>
                    <Styled.Divider />
                    <Styled.Stat>
                        <p>AVG WPM</p>
                        <p>{roundToFixed(quote.avg_wpm)}</p>
                    </Styled.Stat>
                    <Styled.Divider />
                    <Styled.Stat>
                        <p>AVG ACC</p>
                        <p>{`${roundToFixed(quote.avg_acc)}%`}</p>
                    </Styled.Stat>
                </div>
                <div>
                    <Styled.Stat>
                        <p>AUTHOR</p>
                        <p>{quote.author}</p>
                    </Styled.Stat>
                    <Styled.Divider />
                    <Styled.Stat>
                        <p>BOOK</p>
                        <p>{quote.source}</p>
                    </Styled.Stat>
                </div>
            </Styled.Stats>
        </Styled.Quote>
    );
};

export default Quotes;
