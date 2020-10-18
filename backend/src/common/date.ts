export function isValidDate(d: Date) {
    return d && d instanceof Date && !isNaN(d.getTime());
}