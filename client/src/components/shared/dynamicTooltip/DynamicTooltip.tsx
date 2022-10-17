import { useRef, useEffect, useState } from "react"
import Tooltip from "@material-ui/core/Tooltip";
import styles from './DynamicTooltip.module.css';

export enum PlacementEnum {
    TOP = "top",
    BOTTOM = "bottom",
    BOTTOM_START = "bottom-start",
}
interface IProps {
    value: any,
    tooltipClassName?: any,
    tooltipArrowClassName?: any,
    className?: any,
    children?: any,
    showAlways?: boolean,
    interactive?: boolean,
    multiLine?: boolean,
    hideTooltip?: boolean,
    onClick?: any,
    placement?: PlacementEnum,
    fullWidth?: boolean,
    showArrow?: boolean,
    keepHoverListeners?: boolean
}

export default function DynamicTooltip({
    value,
    tooltipClassName = '',
    tooltipArrowClassName = '',
    className = '',
    children,
    showAlways = false,
    interactive = false,
    multiLine = false,
    hideTooltip = false,
    onClick,
    placement = PlacementEnum.TOP,
    fullWidth = false,
    showArrow = true,
    keepHoverListeners = false
}: IProps) {
    const textElementRef: any = useRef();
    const [hoverStatus, setHover] = useState(false);

    const compareSize = () => {
        let compare = textElementRef.current.scrollWidth > textElementRef.current.clientWidth && textElementRef.current.clientWidth !== 0;
        if (multiLine) {
            compare = compare || textElementRef.current.scrollHeight > textElementRef.current.clienHeight;
        }
        setHover(compare);
    }

    const tooltipClasses = [
        styles.tooltip,
        fullWidth ? styles.fullWidth : null,
        tooltipClassName,
        hideTooltip ? styles.hidenTooltip :  null
    ].filter(cls => cls).join(' ');

    useEffect(() => {
        compareSize();
    }, []);

    return (
        <Tooltip
            placement={placement}
            title={value}
            interactive={interactive}
            disableHoverListener={!keepHoverListeners && (hideTooltip || (!showAlways && !hoverStatus))}
            classes={{
                tooltip: tooltipClasses,
                arrow: `${styles.tooltipArrow} ${tooltipArrowClassName}`
            }}
            arrow={showArrow}
        >
            <div
                ref={textElementRef}
                onClick={onClick}
                className={`${styles.wrap} ${className}`}
            >
                {children}
            </div>
        </Tooltip>
    );
};