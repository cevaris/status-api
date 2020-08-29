export function normalize(s: string): string {
    return s.toLowerCase().replace(' ', '_');
}