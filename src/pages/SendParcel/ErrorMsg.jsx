export const ErrorMsg = ({ error }) =>
    error ? <p className="text-red-500">This field is required.</p> : null;
