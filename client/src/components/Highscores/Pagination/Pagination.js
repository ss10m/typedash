// Libraries & utils
import { useEffect, useState } from "react";
import classnames from "classnames";

// Hooks
import { useEventListener } from "hooks";

// Icons
import {
    FaAngleLeft,
    FaAngleRight,
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
} from "react-icons/fa";

// SCSS
import "./Pagination.scss";

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

    return (
        <div
            className={classnames("footer", {
                disabled,
            })}
            style={{ marginBottom }}
        >
            <div className="cus-btn left" onClick={handleBackwardClick}>
                <FaAngleDoubleLeft />
            </div>
            <div className="cus-btn left" onClick={handlePreviousClick}>
                <FaAngleLeft />
            </div>
            <Input
                page={page}
                updatePage={updatePage}
                pageCount={pageCount}
                disabled={disabled}
            />
            <div className="cus-btn right" onClick={handleNextClick}>
                <FaAngleRight />
            </div>
            <div className="cus-btn right" onClick={handleForwardClick}>
                <FaAngleDoubleRight />
            </div>
        </div>
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
        <div className="input">
            <input
                value={inputValue}
                onChange={onChange}
                onBlur={confirmValue}
                onFocus={handleFocus}
                disabled={disabled}
            />
            {` / ${pageCount}`}
        </div>
    );
};

export default Pagination;
