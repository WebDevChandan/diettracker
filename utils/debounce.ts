let timer: any;
export const debounce = (func: (search: string) => {}, delay: number): void => {
    clearTimeout(timer);
    timer = setTimeout(func, delay);
}