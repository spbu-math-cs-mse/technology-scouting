import { Snackbar, Alert } from '@mui/material';

type ErrorAlertProps = {
  opened: boolean;
  setOpened: (open: boolean) => void;
  errorText: string;
};

export default function ErrorAlert(props: ErrorAlertProps) {
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    props.setOpened(false);
  };

  return (
    <Snackbar open={props.opened} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {props.errorText}
      </Alert>
    </Snackbar>
  );
}
