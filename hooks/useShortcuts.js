import { useEffect, useCallback } from "react";

export default function useShortcuts(code, cb) {
    const keyboardShortcuts = useCallback(event => {
        const keycode = event.key;

        if (keycode == code) {
            cb && cb();
        }
    }, [cb, code]);

    useEffect(() => {
        // attach event listener
        document.addEventListener('keyup', keyboardShortcuts);

        // remove event listener
        return () => {
            document.removeEventListener('keyup', keyboardShortcuts);
        }
    }, [keyboardShortcuts]);
}