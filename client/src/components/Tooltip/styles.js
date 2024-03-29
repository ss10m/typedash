import styled from "styled-components";

export const Wrapper = styled.div`
    .tooltip-container {
        --tooltipBackground: #2c3f54;
        --tooltipBorder: #3a5068;

        background-color: var(--tooltipBackground);
        border-radius: 3px;
        border: 2px solid var(--tooltipBorder);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.38);
        color: whitesmoke;
        display: flex;
        flex-direction: column;
        transition: opacity 0.3s;
        z-index: 9999;

        padding: 3px 5px;
        font-weight: 700;

        .tooltip-arrow {
            height: 1rem;
            position: absolute;
            width: 1rem;
        }

        .tooltip-arrow::before {
            border-style: solid;
            content: "";
            display: block;
            height: 0;
            margin: auto;
            width: 0;
        }

        &[data-popper-placement*="bottom"] {
            .tooltip-arrow {
                left: 0;
                margin-top: -0.4rem;
                top: 0;
            }

            .tooltip-arrow::before {
                border-color: transparent transparent var(--tooltipBorder) transparent;
                border-width: 0 0.5rem 0.4rem 0.5rem;
                position: absolute;
                top: -1px;
            }
        }

        &[data-popper-placement*="top"] {
            .tooltip-arrow {
                bottom: 0;
                left: 0;
                margin-bottom: -1rem;
            }

            .tooltip-arrow::before {
                border-color: var(--tooltipBorder) transparent transparent transparent;
                border-width: 0.4rem 0.5rem 0 0.5rem;
                position: absolute;
                top: 1px;
            }
        }

        &[data-popper-placement*="right"] {
            .tooltip-arrow {
                left: 0;
                margin-left: -0.7rem;
            }

            .tooltip-arrow::before {
                border-color: transparent var(--tooltipBorder) transparent transparent;
                border-width: 0.5rem 0.4rem 0.5rem 0;
            }
        }

        &[data-popper-placement*="left"] {
            .tooltip-arrow {
                margin-right: -0.7rem;
                right: 0;
            }

            .tooltip-arrow::before {
                border-color: transparent transparent transparent var(--tooltipBorder);
                border-width: 0.5rem 0 0.5rem 0.4em;
            }
        }
    }
`;
