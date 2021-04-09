// Libraries & utils
import { useState, useEffect, forwardRef } from "react";
import { useHistory } from "react-router-dom";

// Socket API
import SocketAPI from "core/SocketClient";

// Constants
import { handleResponse, roundToFixed } from "helpers";

// Components
import withClickWatcher from "../withClickWatcher/withClickWatcher";

// Styles
import * as Styles from "./styles";

const QuoteModal = ({ quoteId, closeModal }) => {
    const history = useHistory();
    const [isCreating, setIsCreating] = useState(false);
    const [quote, setQuote] = useState(null);

    useEffect(() => {
        fetch(`/api/quote/${quoteId}`)
            .then(handleResponse)
            .then(({ quote }) => {
                setQuote(quote);
            })
            .catch(() => closeModal());
    }, [quoteId, closeModal]);

    useEffect(() => {
        const socket = SocketAPI.getSocket();
        socket.on("room-created", (roomId) => {
            history.push(`/room/${roomId}`);
        });

        return () => {
            socket.off("room-created");
        };
    }, [history]);

    useEffect(() => {
        const scrollY = window.pageYOffset;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;

        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            window.scrollTo(0, scrollY);
        };
    }, []);

    const createRoom = (quoteId) => {
        if (isCreating) return;
        setIsCreating(true);
        SocketAPI.createRoom(quoteId);
    };

    return (
        <Styles.Background>
            <Styles.Wrapper>
                {quote && (
                    <Modal quote={quote} createRoom={createRoom} closeModal={closeModal} />
                )}
            </Styles.Wrapper>
        </Styles.Background>
    );
};

const Modal = withClickWatcher(
    forwardRef((props, ref) => {
        const { isVisible, quote, createRoom, closeModal } = props;

        useEffect(() => {
            if (!isVisible) closeModal();
        }, [isVisible, closeModal]);

        return (
            <Styles.Modal ref={ref}>
                <Header quote={quote} createRoom={createRoom} closeModal={closeModal} />
                <Styles.Quote>{quote.text}</Styles.Quote>
                <Stats quote={quote} />
            </Styles.Modal>
        );
    })
);

const Header = ({ quote, createRoom, closeModal }) => {
    return (
        <Styles.Header>
            <p>{`#${quote.id}`}</p>
            <div>
                <Styles.Button onClick={() => createRoom(quote.id)}>PLAY</Styles.Button>
                <Styles.Button onClick={closeModal} close>
                    CLOSE
                </Styles.Button>
            </div>
        </Styles.Header>
    );
};

const Stats = ({ quote }) => {
    return (
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
    );
};

export default QuoteModal;
