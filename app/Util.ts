
export function NullOrWhitespace(target: string): boolean {
    if (target == null || target == undefined || target == "") return true;
    return false;
}