export function resolveDirection(from, to) {
    if (to.x > from.x) return "rd";
    if (to.x < from.x) return "lu";
    if (to.y > from.y) return "ld";
    if (to.y < from.y) return "ru";
    return "ld";
}
