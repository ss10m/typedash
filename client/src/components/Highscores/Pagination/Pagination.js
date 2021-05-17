// Libraries & utils
import { useEffect, useState } from "react";

// Hooks
import { useEventListener } from "hooks";

// Icons
import {
    FaAngleLeft,
    FaAngleRight,
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
} from "react-icons/fa";

// Styles
import * as Styled from "./styles";

const Pagination = ({ page, updatePage, pageCount, disabled, marginBottom }) => {
    const handlePreviousClick = () => {
        if (page <= 1) return;
        updatePage(page - 1);
    };

    const handleNextClick = () => {
        if (page >= pageCount) return;
        updatePage(page + 1);
    };

    const handleBackwardClick = () => {
        if (page === 1) return;
        updatePage(1);
    };

    const handleForwardClick = () => {
        if (page === pageCount) return;
        updatePage(pageCount);
    };

    const disabledLeft = disabled || page <= 1;
    const disabledRight = disabled || page >= pageCount;

    return (
        <Styled.Pagination $marginBottom={marginBottom}>
            <Styled.Button onClick={handleBackwardClick} $disabled={disabledLeft} $left>
                <FaAngleDoubleLeft />
            </Styled.Button>
            <Styled.Button onClick={handlePreviousClick} $disabled={disabledLeft} $left>
                <FaAngleLeft />
            </Styled.Button>
            <Input
                page={page}
                updatePage={updatePage}
                pageCount={pageCount}
                disabled={disabled}
            />
            <Styled.Button onClick={handleNextClick} $disabled={disabledRight} $right>
                <FaAngleRight />
            </Styled.Button>
            <Styled.Button onClick={handleForwardClick} $disabled={disabledRight} $right>
                <FaAngleDoubleRight />
            </Styled.Button>
        </Styled.Pagination>
    );
};

const Input = ({ page, updatePage, pageCount, disabled }) => {
    const [inputValue, setInputValue] = useState(page);

    useEffect(() => {
        setInputValue(page);
    }, [page]);

    const keyDownHandler = (event) => {
        if (event.code !== "Enter") return;
        event.target.blur();
    };

    useEventListener("keydown", keyDownHandler);

    const onChange = (event) => {
        setInputValue(event.target.value);
    };

    const confirmValue = () => {
        let value = parseInt(inputValue);
        if (!Number.isInteger(value)) {
            return setInputValue(page);
        }
        value = Math.min(value, pageCount);
        value = Math.max(1, value);
        updatePage(value);
        setInputValue(value);
    };

    const handleFocus = (event) => {
        event.target.select();
    };

    return (
        <Styled.InputContainer>
            <input
                value={inputValue}
                onChange={onChange}
                onBlur={confirmValue}
                onFocus={handleFocus}
                disabled={disabled}
            />
            <span>{` / ${pageCount}`}</span>
        </Styled.InputContainer>
    );
};

export default Pagination;
