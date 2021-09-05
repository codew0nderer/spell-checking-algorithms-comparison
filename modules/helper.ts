import { performance } from 'perf_hooks';

export default function calculateTime(string: string, fnToBench: (text: string) => string[] | void) {
    let start = performance.now();
    let spellCheckedWords = fnToBench.call(this, string);
    let end = performance.now();
    if (spellCheckedWords) {
        console.log(spellCheckedWords.length);
    }

    return end - start;
}

// function calculateTime(string: string, buildDictionaryFn: (text: string) => void) {
//     let start = performance.now();
//     buildDictionaryFn.call(this, string);
//     let end = performance.now();

//     return end - start;
// }

// export { calculateTime as spellCalculateTime, calculateTime as dictCalculateTime };
