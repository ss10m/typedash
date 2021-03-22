// Libraries & utils
import { usePopperTooltip } from "react-popper-tooltip";
import classnames from "classnames";

// SCSS
import "./Tooltip.scss";

const Tooltip = (props) => {
    const {
        getArrowProps,
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
        visible,
    } = usePopperTooltip({ placement: props.placement });

    return (
        <div>
            <div
                className={classnames({ "tooltip-fullHeight": props.fullHeight })}
                ref={setTriggerRef}
            >
                {props.children}
            </div>
            {visible && props.visible && (
                <div
                    ref={setTooltipRef}
                    {...getTooltipProps({ className: "tooltip-container" })}
                >
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                    {props.msg}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
