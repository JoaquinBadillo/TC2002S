import { useEffect } from "preact/hooks";

interface Props {
    message: string;
    show: boolean;
    setShow: (arg: boolean) => void;
}

export function Error({message, show, setShow}: Props) {
    if (!message) return null;

    const close = () => setShow(false);

    useEffect(() => {
        setTimeout(() => setShow(false), 5000);
    }, [message]);

    return (
        show ? (
        <div className="flash-messages">
            <div className="error">
                {message}
                <button onClick={close}>&#10060;</button>
            </div>
        </div>
        ) : null
    );
}