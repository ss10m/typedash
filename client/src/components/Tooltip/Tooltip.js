// Libraries & utils
import { usePopperTooltip } from "react-popper-tooltip";

// Styles
import * as Styled from "./styles";

const Tooltip = (props) => {
    const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
        usePopperTooltip({ placement: props.placement });

    return (
        <Styled.Wrapper>
            <div ref={setTriggerRef}>{props.children}</div>
            {visible && props.visible && (
                <div
                    ref={setTooltipRef}
                    {...getTooltipProps({ className: "tooltip-container" })}
                >
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                    {props.msg}
                </div>
            )}
        </Styled.Wrapper>
    );
};

export default Tooltip;
