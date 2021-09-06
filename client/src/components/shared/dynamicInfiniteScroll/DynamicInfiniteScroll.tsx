import { useEffect, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './DynamicInfiniteScroll.module.css';
import './DynamicInfiniteScroll.css';
import DynamicLoader from '../dynamicLoader/DynamicLoader';
const LOADER_HEIGHT = 125;

interface IProps {
    onScroll?: any;
    onScrollFrame?: any;
    scrollOffset?: number;
    hideHorizontalTrack?: boolean;
    horizontalTrackStyles?: string;
    contentWrapperStyle?: string;
    wrapStyleOverride?: string;
    isLoading?: boolean;
    children: any;
    minHeight?: number;
    maxHeight?: number | string;
    autoHeight?: boolean;
    fixScrollPosition?: boolean;
    manual?: boolean;
}

export default function DynamicInfiniteScroll(props: IProps) {
    const { fixScrollPosition, onScrollFrame, hideHorizontalTrack, children, isLoading, horizontalTrackStyles, contentWrapperStyle, wrapStyleOverride, autoHeight, minHeight, maxHeight } = props;
    const scrollbarRef: any = useRef(null);

    const onScrollHandler = () => {
        const { isLoading, onScroll, scrollOffset } = props;
        
        if (isLoading) {
            return;
        }
        if (scrollOffset && (Math.ceil(scrollbarRef.current.getScrollTop() + scrollbarRef.current.getClientHeight()) + scrollOffset) < scrollbarRef.current.getScrollHeight()) {
            return;
        }

        if (onScroll) {
            onScroll();
        }
    }

    useEffect(() => {
        if (fixScrollPosition && !isLoading) {
            const scrollTop = scrollbarRef && scrollbarRef.current && scrollbarRef.current.getScrollTop();
            if (scrollTop) {
                scrollbarRef.current.scrollTop(scrollTop + LOADER_HEIGHT);
            }
        }
        scrollOnNoScroll();
    })

    const scrollOnNoScroll = () => {
        const { manual, onScroll } = props;
        if (scrollbarRef.current && !manual && !isLoading) {
            //Fetch another page
            if (scrollbarRef.current.getClientHeight() && (Math.abs(scrollbarRef.current.getClientHeight() - scrollbarRef.current.getScrollHeight()) <= 2)) {
                onScroll && onScroll();
            }
        }
    }

    const renderView = ({ ...props }) => {
        return (
            <div className="scroll-view" {...props} />
        )
    }

    const renderVerticalThumb = ({ style, ...props }: any) => {
        return (
            <div className={`scroll-vertical-thumb ${styles.thumb}`}
                style={{ ...style }}
                {...props} />
        )
    }

    const renderHorizontalTrack = ({ ...props }) => {
        if (hideHorizontalTrack) {
            return <span></span>
        }
        const classesOverride = `${styles.horizontalTrack} ${horizontalTrackStyles}`;
        return (
            <div className={`scroll-horizontal-track ${classesOverride}`}
                {...props} />
        )
    }

    const renderHorizontalThumb = ({ ...props }) => {
        return (
            <div className={`scroll-horizontal-thumb ${styles.thumb}`}
                {...props} />
        )
    }

    const mainWrapOverride = `${styles.wrap} ${wrapStyleOverride}`

    return (
        <Scrollbars ref={scrollbarRef}
            onScroll={onScrollHandler}
            onScrollFrame={onScrollFrame}
            renderView={renderView}
            renderThumbVertical={renderVerticalThumb}
            renderTrackHorizontal={renderHorizontalTrack}
            renderThumbHorizontal={renderHorizontalThumb}
            className={mainWrapOverride}
            autoHeight={autoHeight}
            autoHeightMin={minHeight}
            autoHeightMax={maxHeight}
        >
            <div className={contentWrapperStyle}>
                {children}
            </div>
            {
                isLoading && <div className={styles.loaderWrap}>
                    <DynamicLoader />
                </div>
            }
        </Scrollbars>
    )
}

DynamicInfiniteScroll.defaultProps = {
    scrollOffset: 1,
    minHeight: 0,
    maxHeight: 'none',
    autoHeight: true,
    color: 'primary',
    fixScrollPosition: false,
    manual: false
}