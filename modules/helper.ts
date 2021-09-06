import { performance } from 'perf_hooks';

export default function calculateTime(string: string, fnToBench: (text: string) => string[] | void) {
    let start = performance.now();
    fnToBench.call(this, string);
    let end = performance.now();

    return end - start;
}
