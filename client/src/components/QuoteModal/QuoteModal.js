// Libraries & utils
import { useState, useEffect, forwardRef } from "react";
import { useHistory } from "react-router-dom";

// Socket API
import SocketAPI from "core/SocketClient";

// Hooks
import { useEventListener } from "hooks";

// Constants
import { handleResponse, roundToFixed } from "helpers";

// Components
import withClickWatcher from "../withClickWatcher/withClickWatcher";

// Styles
import * as Styled from "./styles";

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

    useEventListener("keydown", (event) => {
        if (event.keyCode === 27) {
            closeModal();
        }
    });

    const createRoom = (quoteId) => {
        if (isCreating) return;
        setIsCreating(true);
        SocketAPI.createRoom(quoteId);
    };

    return (
        <Styled.Background>
            <Styled.Wrapper>
                {quote && (
                    <Modal quote={quote} createRoom={createRoom} closeModal={closeModal} />
                )}
            </Styled.Wrapper>
        </Styled.Background>
    );
};

const Modal = withClickWatcher(
    forwardRef((props, ref) => {
        const { isVisible, quote, createRoom, closeModal } = props;

        useEffect(() => {
            if (!isVisible) closeModal();
        }, [isVisible, closeModal]);

        return (
            <Styled.Modal ref={ref}>
                <Header quote={quote} createRoom={createRoom} closeModal={closeModal} />
                <Styled.Quote>{quote.text}</Styled.Quote>
                <Stats quote={quote} />
            </Styled.Modal>
        );
    })
);

const Header = ({ quote, createRoom, closeModal }) => {
    return (
        <Styled.Header>
            <p>{`#${quote.id}`}</p>
            <div>
                <Styled.Button onClick={() => createRoom(quote.id)}>PLAY</Styled.Button>
                <Styled.Button onClick={closeModal} close>
                    CLOSE
                </Styled.Button>
            </div>
        </Styled.Header>
    );
};

const Stats = ({ quote }) => {
    return (
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
    );
};

export default QuoteModal;
