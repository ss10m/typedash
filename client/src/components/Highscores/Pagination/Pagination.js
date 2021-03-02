// Libraries & utils
import { useEffect, useState } from "react";

// Icons
import {
    FaAngleLeft,
    FaAngleRight,
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
} from "react-icons/fa";

// SCSS
import "./Pagination.scss";

const Pagination = ({ page, setPage }) => {
    const [pageCount, setPageCount] = useState(3);

    const handlePreviousClick = () => {
        if (page <= 1) return;
        setPage((current) => current - 1);
    };

    const handleNextClick = () => {
        if (page >= pageCount) return;
        setPage((current) => current + 1);
    };

    const handleBackwardClick = () => {
        if (page === 1) return;
        setPage(1);
    };

    const handleForwardClick = () => {
        if (page === pageCount) return;
        setPage(pageCount);
    };

    const updatePage = (updatedPage) => {
        setPage(updatedPage);
    };

    return (
        <div className="footer">
            <div className="cus-btn left" onClick={handleBackwardClick}>
                <FaAngleDoubleLeft />
            </div>
            <div className="cus-btn left" onClick={handlePreviousClick}>
                <FaAngleLeft />
            </div>
            <Input page={page} updatePage={updatePage} pageCount={pageCount} />
            <div className="cus-btn right" onClick={handleNextClick}>
                <FaAngleRight />
            </div>
            <div className="cus-btn right" onClick={handleForwardClick}>
                <FaAngleDoubleRight />
            </div>
        </div>
    );
};

const Input = ({ page, updatePage, pageCount }) => {
    const [inputValue, setInputValue] = useState(page);

    useEffect(() => {
        setInputValue(page);
    }, [page]);

    const onChange = (event) => {
        console.log("ON CHANGE: " + event.target.value);
        setInputValue(event.target.value);
    };

    const confirmValue = () => {
        let value = parseInt(inputValue);
        if (!Number.isInteger(value)) value = 1;
        value = Math.min(value, pageCount);
        value = Math.max(1, value);
        console.log("SET TO: " + value);
        updatePage(value);
        setInputValue(value);
    };

    const handleFocus = (event) => {
        //event.target.select();
        //event.target.setSelectionRange(0, 1);
        event.target.select();
    };

    return (
        <div className="input">
            <input
                value={inputValue}
                onChange={onChange}
                onBlur={confirmValue}
                onFocus={handleFocus}
            />
            {` / ${pageCount}`}
        </div>
    );
};

export default Pagination;
