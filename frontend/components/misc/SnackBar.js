import React from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import CheckCircle from '@material-ui/icons/CheckCircle';

import styles from './SnackBar.css';


const SnackBar = (props)=>{
    const {snackbarValue,snackbarClose} = props;
    return(
        <Snackbar 
            anchorOrigin={{
                vertical:'bottom',
                horizontal:'right'
            }}
            open={snackbarValue}
            onClose={snackbarClose}
            autoHideDuration={2000}
        >
            <SnackbarContent 
                className={styles.success}
                message={
                    <span className={styles.message}>
                    <CheckCircle className={styles.marginright} />
                    {props.children}
                    </span>
                }
                action={[
                    <IconButton key="close" className={styles.iconcolor} onClick={snackbarClose}>
                        <Close />
                    </IconButton>
                ]}
            />
        </Snackbar>
    )
}

export default SnackBar;