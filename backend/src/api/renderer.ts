import toJson from 'json-stable-stringify';

export function renderJson(x: any): string {
    return toJson(x, { space: '  ' });
}