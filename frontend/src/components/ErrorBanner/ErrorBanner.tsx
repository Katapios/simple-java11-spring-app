import { useEffect, useState } from 'react';
import './ErrorBanner.css';

type ErrorBannerProps = {
    error: string | null;
    onDismiss?: () => void;
    autoDismissTimeout?: number;
};

export const ErrorBanner = ({
                                error,
                                onDismiss,
                                autoDismissTimeout = 5000
                            }: ErrorBannerProps) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (error) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                onDismiss?.();
            }, autoDismissTimeout);

            return () => clearTimeout(timer);
        } else {
            setVisible(false);
        }
    }, [error, autoDismissTimeout, onDismiss]);

    if (!visible || !error) return null;

    return (
        <div
            className="error-banner"
            onClick={() => {
                setVisible(false);
                onDismiss?.();
            }}
            role="alert"
        >
            <div className="error-banner-content">
                <span className="error-banner-message">{error}</span>
                <button className="error-banner-close" aria-label="Close">
                    &times;
                </button>
            </div>
        </div>
    );
};
