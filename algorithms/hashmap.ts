export default class HashMap {
    capacity = 262144; // m = 2^18
    ditionary: string[] = new Array(this.capacity);
    size = 0;
    threshold = 0.5;

    // Insert a word into the hash table
    insert(word: string) {
        const loadFactor = this.size / this.capacity;
        if (loadFactor >= this.threshold) {
            this.#rehashing();
        }
        this.#insertHelper(word);
    }

    // Insert helper method
    #insertHelper(word: string) {
        const key = this.#stringToUint32(word);
        const firstHash = this.#firstHash(key);
        if (this.ditionary[firstHash] != undefined) {
            let i = 1;
            const secondHash = this.#secondHash(key);
            while (true) {
                const hash = (firstHash + i * secondHash) % this.capacity;
                if (this.ditionary[hash] == undefined) {
                    this.ditionary[hash] = word;
                    this.size++;
                    break;
                }
                i++;
            }
        } else {
            this.ditionary[firstHash] = word;
            this.size++;
        }
    }

    // Check if a word exists in the hash table
    #find(word: string): boolean {
        let found = true;
        const key = this.#stringToUint32(word);
        const firstHash = this.#firstHash(key);
        if (this.ditionary[firstHash] != word) {
            let i = 1;
            const secondHash = this.#secondHash(key);
            while (true) {
                const hash = (firstHash + i * secondHash) % this.capacity;
                if (this.ditionary[hash] == undefined) {
                    found = false;
                    break;
                } else if (this.ditionary[hash] == word) {
                    break;
                }
                i++;
            }
        }
        return found;
    }

    // Hash method takes key as input
    // returns a hash between 0 and m-1 (m is table capacity)
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

    // Secondary hash method returns the step size value
    // returned value should bea relatively prime to the table capacity
    // to loop over all table elements
    #secondHash(key: number) {
        let hash = (key % this.capacity) / 2 - 1;
        if (hash < 0) {
            hash += this.capacity / 2 - 1;
        }
        hash = hash * 2 + 1;

        return hash;
    }

    // Resize the hash table and rehash its elements
    // when the threshold is reached
    #rehashing() {
        const newCapacity = this.capacity * 2;
        const oldDict = this.ditionary;
        this.capacity = newCapacity;
        this.ditionary = new Array(newCapacity);
        this.size = 0;
        for (let i = 0; i < oldDict.length; i++) {
            const word = oldDict[i];
            if (word) {
                this.#insertHelper(word);
            }
        }
    }

    // Convert word to key code
    // The sum of each char ASCII code multiplied by its position.
    #stringToUint32(word: string) {
        let g = 3;
        let key = 0;
        for (let i = 0; i < word.length; i++) {
            key = key * g + word.charCodeAt(i);
        }
        key *= word.length;

        return key % this.capacity;
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
