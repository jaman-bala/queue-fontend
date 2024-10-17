import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    let errorMessage = 'Произошла непредвиденная ошибка.';

    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (
        typeof error === 'object' &&
        error !== null &&
        'statusText' in error
    ) {
        errorMessage =
            (error as { statusText?: string }).statusText || errorMessage;
    }

    return (
        <div
            id="error-page"
            style={{
                height: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <h1>Упс!</h1>
            <p>Извините, произошла непредвиденная ошибка.</p>
            <p>
                <i>{errorMessage}</i>
            </p>
        </div>
    );
}
