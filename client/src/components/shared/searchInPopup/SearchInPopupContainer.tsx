import SearchInPopup from "./SearchInPopup";
import { useSelector, useDispatch } from "react-redux";
import { getSearchText } from "./SearchInPopupSlice";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import styles from './SearchInPopupContainer.module.css';
import GenericHelpers from "../GenericHelpers";
import { openSnackbar } from "../dynamicSnackbar/DynamicSnackbarSlice";
import Tooltip from '@material-ui/core/Tooltip';

export default function SearchInPopupContainer () {
    
    const dispatch = useDispatch();
    const selectedSearchText = useSelector(getSearchText);
    const searchTextConfig = {
        maxLength: 200,
        minLength: 1
    };

    const handleCopyToClipboard = () => {
        GenericHelpers.copyToClipboard(selectedSearchText);
        dispatch(openSnackbar({
            message: 'Copied to clipboard',
            severity: 'success'
        }));
    }

    const getSearchPopupActions = () => {
        const searchItems = [
            {
                render: () => {
                    return <Tooltip title="Copy" arrow placement="top">
                        <FileCopyIcon
                            className={styles.button}
                        />
                    </Tooltip>
                },
                onClick: handleCopyToClipboard
            }
        ]

        return searchItems;
    }

    return <SearchInPopup
        maxLenght={searchTextConfig.maxLength}
        minLength={searchTextConfig.minLength}
        searchActions={getSearchPopupActions()}
        text={selectedSearchText}
    />
}