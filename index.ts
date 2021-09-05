import * as fs from 'fs';
import Naive from './algorithms/naive';
import BBST from './algorithms/bbst';
import Trie from './algorithms/trie';
import HashMap from './algorithms/hashmap';
import calculateTime from './modules/helper';

let naive = new Naive();
let bbst = new BBST();
let trie = new Trie();
let hashMap = new HashMap();
const wordlistTxt = fs.readFileSync('words-list.txt', 'utf8');
const text = fs.readFileSync('book.txt', 'utf8');

const repetition = 5;
const initialTextLength = 1000;
const maxTextLength = text.length;

let csvFileContentDict = '"text size","naive","bbst","trie","hash"\n';
let csvFileContentSpell = csvFileContentDict;

var textLength = maxTextLength;
// Calculate dictionnary building time
let timeNaiveDict = 0;
let timeBBSTDict = 0;
let timeTrieDict = 0;
let timeHashDict = 0;

for (let i = 0; i < repetition; i++) {
    timeNaiveDict += calculateTime.call(naive, wordlistTxt, naive.buildDictionary);
    timeBBSTDict += calculateTime.call(bbst, wordlistTxt, bbst.buildDictionary);
    timeTrieDict += calculateTime.call(trie, wordlistTxt, trie.buildDictionary);
    timeHashDict += calculateTime.call(hashMap, wordlistTxt, hashMap.buildDictionary);
}

let resultNaiveDict = timeNaiveDict / repetition;
let resultBBSTDict = timeBBSTDict / repetition;
let resultTrieDict = timeTrieDict / repetition;
let resultHashDict = timeHashDict / repetition;

csvFileContentDict += `${textLength}, ${resultNaiveDict}, ${resultBBSTDict}, ${resultTrieDict}, ${resultHashDict} \n`;
// End - Calculate dictionnary building time

// Calculate spell checking time
// while (textLength < maxTextLength) {
const currentText = text.slice(0, textLength);
let timeNaiveSpell = 0;
let timeBBSTSpell = 0;
let timeTrieSpell = 0;
let timeHashSpell = 0;

for (let i = 0; i < repetition; i++) {
    timeNaiveSpell += calculateTime.call(naive, text, naive.spellCheck);
    timeBBSTSpell += calculateTime.call(bbst, text, bbst.spellCheck);
    timeTrieSpell += calculateTime.call(trie, text, trie.spellCheck);
    timeHashSpell += calculateTime.call(hashMap, text, hashMap.spellCheck);
}

let resultNaiveSpell = timeNaiveSpell / repetition;
let resultBBSTSpell = timeBBSTSpell / repetition;
let resultTrieSpell = timeTrieSpell / repetition;
let resultHashSpell = timeHashSpell / repetition;

csvFileContentSpell += `${textLength}, ${resultNaiveSpell}, ${resultBBSTSpell}, ${resultTrieSpell}, ${resultHashSpell} \n`;

// if (textLength >= 10000) {
//     textLength += 2000;
// } else if (textLength >= 2000) {
//     textLength += 500;
// } else {
//     textLength += 100;
// }
// }

// End - Calculate spell checking time

fs.writeFileSync('result_dict_tests.csv', csvFileContentDict, { flag: 'w+' });
fs.writeFileSync('result_spell_tests.csv', csvFileContentSpell, { flag: 'w+' });

console.log('End');
