export default class Naive {
    dictionary: string[] = [];

    buildDictionary(wordlistTxt: string) {
        let wordStart = 0;
        for (let i = 0; i < wordlistTxt.length; i++) {
            const char = wordlistTxt[i];
            if (char === '\r' || char === '\n' || char === '\n') {
                if (i > wordStart) {
                    const word = wordlistTxt.substring(wordStart, i).toLowerCase();
                    this.dictionary.push(word);
                }
                wordStart = i + 1;
            }
        }

        return this.dictionary;
    }

    spellCheck(text: string) {
        let wordStart = 0;
        let spellChecked: string[] = [];

        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            if (char < 65 || char > 122 || (char > 90 && char < 97)) {
                if (i > wordStart) {
                    const word = text.substring(wordStart, i).toLowerCase();
                    let found = false;

                    for (let j = 0; j < this.dictionary.length; j++) {
                        const dictWord = this.dictionary[j];
                        if (dictWord === word.toLowerCase()) {
                            found = true;
                            break;
                        }
                    }

                    if (!found && !spellChecked.includes(word)) {
                        spellChecked.push(word);
                    }
                }

                wordStart = i + 1;
            }
        }

        return spellChecked;
    }
}
