export default class HashMap {
    capacity = 262144; // m = 2^18
    dictionnary: string[] = new Array(this.capacity);
    size = 0;
    threshold = 0.5;
    colisionFaced = 0;

    insert(word: string) {
        const loadFactor = this.size / this.capacity;
        if (loadFactor >= this.threshold) {
            this.#rehashing();
        }
        this.#insert_helper(word);
    }

    #insert_helper(word: string) {
        const key = this.#stringToUint32(word);
        const firstHash = this.#firstHash(key);
        if (this.dictionnary[firstHash] != undefined) {
            let i = 1;
            const secondHash = this.#secondHash(key);
            while (true) {
                const hash = (firstHash + i * secondHash) % this.capacity;
                if (this.dictionnary[hash] == undefined) {
                    this.dictionnary[hash] = word;
                    this.size++;
                    break;
                }
                i++;
            }
        } else {
            this.dictionnary[firstHash] = word;
            this.size++;
        }
    }

    #find(word: string): boolean {
        let found = true;
        const key = this.#stringToUint32(word);
        const firstHash = this.#firstHash(key);
        if (this.dictionnary[firstHash] != word) {
            let i = 1;
            const secondHash = this.#secondHash(key);
            while (true) {
                const hash = (firstHash + i * secondHash) % this.capacity;
                if (this.dictionnary[hash] == undefined) {
                    found = false;
                    break;
                } else if (this.dictionnary[hash] == word) {
                    break;
                }
                i++;
            }
        }
        return found;
    }

    #firstHash(key: number) {
        const a = (Math.sqrt(5) - 1) / 2;
        const kA = key * a;
        const fract = kA - Math.floor(kA);
        let hash = Math.floor(fract * this.capacity);
        if (hash < 0) {
            hash += this.capacity;
        }

        return hash;
    }

    #secondHash(key: number) {
        const debug2 = this.capacity / 2 - 1;
        let debug3 = key % debug2;
        if (debug3 < 0) {
            debug3 += debug2;
        }
        const hash = debug3 * 2 + 1;

        return hash;
    }

    #rehashing() {
        const newCapacity = this.capacity * 2;
        const oldDict = this.dictionnary;
        this.capacity = newCapacity;
        this.dictionnary = new Array(newCapacity);
        this.size = 0;
        for (let i = 0; i < oldDict.length; i++) {
            const word = oldDict[i];
            if (word) {
                this.#insert_helper(word);
            }
        }
    }

    #stringToUint32(word: string) {
        let key = 0;
        for (let i = 0; i < word.length; i++) {
            key += word.charCodeAt(i) * (i + 1);
        }

        return key;
    }

    buildDictionary(wordList: string) {
        let wordStart = 0;
        for (let i = 0; i < wordList.length; i++) {
            const char = wordList[i];
            if (char === '\r' || char === '\n' || char === '\n') {
                if (i > wordStart) {
                    const word = wordList.substring(wordStart, i).toLowerCase();
                    this.insert(word);
                }
                wordStart = i + 1;
            }
        }
    }

    spellCheck(text: string) {
        let wordStart = 0;
        let spellChecked: string[] = [];
        const textLength = text.length;
        for (let i = 0; i < textLength; i++) {
            const char = text.charCodeAt(i);
            if (char < 65 || char > 122 || (char > 90 && char < 97)) {
                if (i > wordStart) {
                    const word = text.substring(wordStart, i).toLowerCase();
                    let found = this.#find(word);

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
