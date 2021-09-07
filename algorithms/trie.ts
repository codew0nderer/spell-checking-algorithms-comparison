class BBST {
    root: PrefixNode = null;

    //return height of the node
    height(N: PrefixNode): number {
        if (N === null) {
            return 0;
        }

        return N.height;
    }

    //right rotate
    rightRotate(y: PrefixNode): PrefixNode {
        let x: PrefixNode = y.left;
        let T2: PrefixNode = x.right;
        x.right = y;
        y.left = T2;
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;

        return x;
    }

    //left rotate
    leftRotate(x: PrefixNode): PrefixNode {
        let y: PrefixNode = x.right;
        let T2: PrefixNode = y.left;
        y.left = x;
        x.right = T2;
        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;

        return y;
    }

    // get balance factor of a node
    #getBalanceFactor(N: PrefixNode): number {
        if (N == null) {
            return 0;
        }

        return this.height(N.left) - this.height(N.right);
    }

    // helper function to insert a node
    #insertNodeHelper = (node: PrefixNode, childNode: PrefixNode) => {
        // find the position and insert the node
        if (node === null) {
            return childNode;
        }

        if (childNode.value < node.value) {
            node.left = this.#insertNodeHelper(node.left, childNode);
        } else if (childNode.value > node.value) {
            node.right = this.#insertNodeHelper(node.right, childNode);
        } else {
            return node;
        }

        // update the balance factor of each node
        // and, balance the tree
        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));

        let balanceFactor = this.#getBalanceFactor(node);

        if (balanceFactor > 1) {
            if (childNode.value < node.left.value) {
                return this.rightRotate(node);
            } else if (childNode.value > node.left.value) {
                node.left = this.leftRotate(node.left);
                return this.rightRotate(node);
            }
        }

        if (balanceFactor < -1) {
            if (childNode.value > node.right.value) {
                return this.leftRotate(node);
            } else if (childNode.value < node.right.value) {
                node.right = this.rightRotate(node.right);
                return this.leftRotate(node);
            }
        }

        return node;
    };

    // insert a node
    insertNode = (node: PrefixNode) => {
        this.root = this.#insertNodeHelper(this.root, node);
    };

    // find helper method
    #findHelper(root: PrefixNode, value: number): PrefixNode {
        if (root == null) {
            return root;
        }

        if (value < root.value) {
            return this.#findHelper(root.left, value);
        } else if (value > root.value) {
            return this.#findHelper(root.right, value);
        }

        return root;
    }

    // find a value in the tree
    find(value: number) {
        const searchedItem = this.#findHelper(this.root, value);
        return searchedItem;
    }
}

class PrefixNode {
    bbst = new BBST();
    value: number;
    left: PrefixNode = null;
    right: PrefixNode = null;
    isEndOfWord: boolean;
    height = 1;

    constructor(value: number, isEndOfWord: boolean) {
        this.value = value;
        this.isEndOfWord = isEndOfWord;
    }

    add(word: string, charIndex: number = 0) {
        let charCode = word.charCodeAt(charIndex);
        let isEndOfWord = word.length == charIndex + 1 ? true : false;
        let node = this.bbst.find(charCode);
        if (!node) {
            node = new PrefixNode(charCode, isEndOfWord);
            this.bbst.insertNode(node);
        }

        if (!isEndOfWord) {
            charIndex++;
            node.add(word, charIndex);
        }
    }

    contains(word: string, charIndex: number = 0): boolean {
        let charCode = word.charCodeAt(charIndex);
        let isEndOfSearchedWord = word.length == charIndex + 1 ? true : false;
        let node = this.bbst.find(charCode);
        if (!node) {
            return false;
        }

        if (isEndOfSearchedWord) {
            if (node.isEndOfWord) {
                return true;
            } else {
                return false;
            }
        } else {
            charIndex++;
            return node.contains(word, charIndex);
        }
    }
}

export default class Trie {
    root = new PrefixNode(null, false);

    add(word: string) {
        let wordLower = word.toLowerCase();
        this.root.add(wordLower);
    }

    contains(word: string) {
        return this.root.contains(word);
    }

    buildDictionary(wordList: string) {
        let wordStart = 0;
        for (let i = 0; i < wordList.length; i++) {
            const char = wordList[i];
            if (char === '\r' || char === '\n' || char === '\n') {
                if (i > wordStart) {
                    const word = wordList.substring(wordStart, i).toLowerCase();
                    this.root.add(word);
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
                    let found = this.contains(word);

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
