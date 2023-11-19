package com.creative_mind.exception;

public class CreativeMindException extends RuntimeException {
    public CreativeMindException() {
    }

    public CreativeMindException(String message) {
        super(message);
    }

    public CreativeMindException(String message, Throwable cause) {
        super(message, cause);
    }

    public CreativeMindException(Throwable cause) {
        super(cause);
    }

    public CreativeMindException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
