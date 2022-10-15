import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { useEffect, useState, useRef } from "react";
import styles from "./SearchInPopup.module.css";

const ACTION_ITEM_WIDTH = 30;
const SEARCH_ACTION_MARGIN = 15;
const CONTAINER_ID = 'searchPopupActivities';

interface ISearchActions {
    render: Function,
    onClick: Function
}
interface IProps {
    text: string;
    searchActions: ISearchActions[];
    minLength: number;
    maxLenght: number;
}

export default function SearchInPopup({ text, searchActions, minLength, maxLenght}: IProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({});
    const [searchValue, setSearchValue] = useState('');

    const usePrevious = (value: any) => {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }
    const prevTextRef: any = usePrevious(text);

    useEffect(() => {
        addEventListeners();
        const textTrimmed = text && text.trim();
        const prevPropsTrimmed = prevTextRef && prevTextRef?.trim();
        if (!textTrimmed && isOpen) {
            return setIsOpen(false);
        }

        if (!Boolean(textTrimmed)) {
            return;
        }

        if (prevPropsTrimmed !== textTrimmed && textIsValid(text)) {
            const position = getSelectionCoordinates();
            if (position) {
                return handleOpenPopup(position);
            }
            if (isOpen) {
                handleClosePopup();
            }
        }
        return () => {
            removeEventListeners();
        }
    }, [text, isOpen])

    const addEventListeners = () => {
        window.addEventListener('scroll', handleClosePopup, true);
        window.addEventListener('mousedown', handleEvent);
        window.addEventListener('hashchange', handleClosePopup);
    }

    const removeEventListeners = () => {
        window.removeEventListener('scroll', handleClosePopup, true);
        window.removeEventListener('mousedown', handleEvent);
        window.removeEventListener('hashchange', handleClosePopup);
    }

    const handleEvent = (e: any) => {
        if (!isOpen) {
            return;
        }

        const eventIsOutSide = checkEventIsOutsidePopup(e);
        if (eventIsOutSide) {
            handleClosePopup();
        }
    }

    const handleClosePopup = () => {
        setIsOpen(false);
        removeEventListeners();
    }

    const handleOpenPopup = (position: any) => {
        const trimmedSearchValue = text && text.trim();
        const popupWidth = 96;
        let left = position.left + position.width / 2 - popupWidth / 2;
        const containerWidth = searchActions.length * ACTION_ITEM_WIDTH + SEARCH_ACTION_MARGIN;
        const rightCoordinatePopup = left + containerWidth;
        const popupIsOutsideWindow = rightCoordinatePopup > window.innerWidth;
        if (popupIsOutsideWindow) {
            left = window.innerWidth - containerWidth - 5;
        }

        setPosition({
            top: position.top,
            left
        })
        setIsOpen(true);
        setSearchValue(trimmedSearchValue);
        addEventListeners();
    }

    const checkEventIsOutsidePopup = (e: any) => {
        let { target } = e;
        if (target.id === CONTAINER_ID) {
            return false;
        }
        let parentElement = target.parentElement;
        while (parentElement) {
            if (parentElement.id === CONTAINER_ID) {
                return false;
            }
            parentElement = parentElement.parentElement;
        }

        return true;
    }

    const getSelectionCoordinates = () => {
        const selection = document.getSelection();
        if (selection && selection.type === 'Range') {
            const position = selection.getRangeAt(0).getBoundingClientRect();
            return position;
        }

        return null;
    }

    const textIsValid = (text: string) => {
        return text.length >= minLength && text.length <= maxLenght;
    }

    const handleActionClick = (onClickHandler: Function) => {
        handleClosePopup();
        onClickHandler && onClickHandler(searchValue);
    }

    const renderTriangle = () => {
        return (
            <div className={styles.arrow}></div>
        )
    }

    const renderContent = () => {
        return <div id={CONTAINER_ID} style={dynamicStyle.wrap(position)}>
            <div className={styles.innerWrap}>
                <div className={styles.searchActionsWrap}>
                    {searchActions.map((action: ISearchActions, index: number) => {
                        return <div
                            onClick={() => handleActionClick(action.onClick)}
                            key={index}
                        >
                            {action.render()}
                        </div>
                    })}
                </div>
                {renderTriangle()}
            </div>
        </div>
    }

    if (!isOpen) {
        return null;
    }

    return renderContent();
}

const dynamicStyle = {
    wrap: (position: any) => {
        const { top, left } = position;
        return {
            position: 'absolute',
            top: top - 50,
            left,
            background: '#fff',
            zIndex: 1450,
            borderRadius: 4
        } as CSSProperties
    }
}