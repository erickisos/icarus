export const isEmptyInput = (value: string | null): boolean => {
    // TODO [EI]: Add unit tests for this method.
    return !value || value.trim().length === 0;
};

export const validateHost = (value: string): string | null => {
    // TODO [EI]: Add unit tests for this method. Magic Number 3 is the minimum length of a domain considering the TLD.
    const hostRegex = /^([a-z0-9]+\.?){3,}$/i;

    if (!hostRegex.test(value)) {
        return 'Host must be a valid domain';
    }
    return null;
};

export const validatePort = (value: string): string | null => {
    // TODO [EI]: Add unit tests for this method.
    const portRegex = /^[0-9]+$/;

    if (!portRegex.test(value)) {
        return 'Port must be a valid number';
    }
    return null;
};

export const validateUsername = (value: string): string | null => {
    // TODO [EI]: Add unit tests for this method.
    const usernameRegex = /^[a-z0-9]+$/i;

    if (!usernameRegex.test(value)) {
        return 'Username must be alphanumeric';
    }
    return null;
};
