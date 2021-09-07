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
const repetition = 10;

// Calculate ditionary building time
let timeNaiveDict = 0;
let timeBBSTDict = 0;
let timeTrieDict = 0;
let timeHashDict = 0;
let csvFileContentDict = '"naive","bbst","trie","hash"\n';
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
csvFileContentDict += `${resultNaiveDict}, ${resultBBSTDict}, ${resultTrieDict}, ${resultHashDict} \n`;
fs.writeFileSync('result_dict.csv', csvFileContentDict, { flag: 'w+' });
// End - Calculate ditionary building time

// Calculate spell checking time
let csvFileContentSpell = '"text size","naive","bbst","trie","hash"\n';
const initialTextLength = 2000;
const maxTextLength = text.length;
var textLength = initialTextLength;
while (textLength <= maxTextLength) {
    let timeNaiveSpell = 0;
    let timeBBSTSpell = 0;
    let timeTrieSpell = 0;
    let timeHashSpell = 0;
    const currentText = text.slice(0, textLength);

    for (let i = 0; i < repetition; i++) {
        timeNaiveSpell += calculateTime.call(naive, currentText, naive.spellCheck);
        timeBBSTSpell += calculateTime.call(bbst, currentText, bbst.spellCheck);
        timeTrieSpell += calculateTime.call(trie, currentText, trie.spellCheck);
        timeHashSpell += calculateTime.call(hashMap, currentText, hashMap.spellCheck);
    }

    let resultNaiveSpell = timeNaiveSpell / repetition;
    let resultBBSTSpell = timeBBSTSpell / repetition;
    let resultTrieSpell = timeTrieSpell / repetition;
    let resultHashSpell = timeHashSpell / repetition;
    csvFileContentSpell += `${textLength}, ${resultNaiveSpell}, ${resultBBSTSpell}, ${resultTrieSpell}, ${resultHashSpell} \n`;

    if (textLength == maxTextLength) {
        textLength++; // To break out of the loop
    } else if (textLength >= 50000) {
        textLength = maxTextLength;
    } else if (textLength >= 10000) {
        textLength += 5000;
    } else {
        textLength += 2000;
    }
}

fs.writeFileSync('result_spell.csv', csvFileContentSpell, { flag: 'w+' });
// End - Calculate spell checking time
