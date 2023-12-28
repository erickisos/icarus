
export function isEmptyInput(value: string | null): boolean {
    // TODO [EI]: Add unit tests for this method.
    return !value || value.trim().length === 0;
}

export function validateHost(value: string) {
    // TODO [EI]: Add unit tests for this method. Magic Number 3 is the minimum length of a domain considering the TLD.
    const hostRegex = /^([a-z0-9]+\.?){3,}$/i;

    if (!hostRegex.test(value)) {
        return 'Host must be a valid domain';
    }
    return null;
}

export function validatePort(value: string) {
    // TODO [EI]: Add unit tests for this method.
    const portRegex = /^[0-9]+$/;

    if (!portRegex.test(value)) {
        return 'Port must be a valid number';
    }
    return null;
}

export function validateUsername(value: string) {
    // TODO [EI]: Add unit tests for this method.
    const usernameRegex = /^[a-z0-9]+$/i;

    if (!usernameRegex.test(value)) {
        return 'Username must be alphanumeric';
    }
    return null;
}
