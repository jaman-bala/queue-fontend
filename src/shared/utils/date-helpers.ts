export function formattedDate(time: string) {
    const dateString = time;

    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour12: false,
        timeZone: 'Asia/Bishkek',
    };

    const formattedDate = date.toLocaleString('ru-RU', options);

    return formattedDate;
}

export function formattedTime(time?: string) {
    if (!time) return '--:--';
    const dateString = time;

    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Bishkek',
    };

    const formattedDate = date.toLocaleString('ru-RU', options);

    return formattedDate;
}
