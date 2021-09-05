// Create node
class Node {
    item: string;
    height = 1;
    left: Node = null;
    right: Node = null;

    constructor(item: string) {
        this.item = item;
    }
}

//AVL Tree
class BBST {
    #root: Node = null;

    //return height of the node
    height(N: Node): number {
        if (N === null) {
            return 0;
        }

        return N.height;
    }

    //right rotate
    rightRotate(y: Node): Node {
        let x: Node = y.left;
        let T2: Node = x.right;
        x.right = y;
        y.left = T2;
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;

        return x;
    }

    //left rotate
    leftRotate(x: Node): Node {
        let y: Node = x.right;
        let T2: Node = y.left;
        y.left = x;
        x.right = T2;
        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;

        return y;
    }

    // get balance factor of a node
    #getBalanceFactor(N: Node): number {
        if (N == null) {
            return 0;
        }

        return this.height(N.left) - this.height(N.right);
    }

    // helper function to insert a node
    #insertNodeHelper = (node: Node, item: string) => {
        // find the position and insert the node
        if (node === null) {
            return new Node(item);
        }

        if (item < node.item) {
            node.left = this.#insertNodeHelper(node.left, item);
        } else if (item > node.item) {
            node.right = this.#insertNodeHelper(node.right, item);
        } else {
            return node;
        }

        // update the balance factor of each node
        // and, balance the tree
        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));

        let balanceFactor = this.#getBalanceFactor(node);

        if (balanceFactor > 1) {
            if (item < node.left.item) {
                return this.rightRotate(node);
            } else if (item > node.left.item) {
                node.left = this.leftRotate(node.left);
                return this.rightRotate(node);
            }
        }

        if (balanceFactor < -1) {
            if (item > node.right.item) {
                return this.leftRotate(node);
            } else if (item < node.right.item) {
                node.right = this.rightRotate(node.right);
                return this.leftRotate(node);
            }
        }

        return node;
    };

    // insert a node
    insertNode = (item: string) => {
        // console.log(root);
        this.#root = this.#insertNodeHelper(this.#root, item);
    };

    //get node with minimum value
    nodeWithMimumValue = (node: Node): Node => {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }

        return current;
    };

    // delete helper
    #deleteNodeHelper = (root: Node, item: string) => {
        // find the node to be deleted and remove it
        if (root == null) {
            return root;
        }
        if (item < root.item) {
            root.left = this.#deleteNodeHelper(root.left, item);
        } else if (item > root.item) {
            root.right = this.#deleteNodeHelper(root.right, item);
        } else {
            if (root.left === null || root.right === null) {
                let temp = null;
                if (temp == root.left) {
                    temp = root.right;
                } else {
                    temp = root.left;
                }

                if (temp == null) {
                    temp = root;
                    root = null;
                } else {
                    root = temp;
                }
            } else {
                let temp = this.nodeWithMimumValue(root.right);
                root.item = temp.item;
                root.right = this.#deleteNodeHelper(root.right, temp.item);
            }
        }
        if (root == null) {
            return root;
        }

        // Update the balance factor of each node and balance the tree
        root.height = Math.max(this.height(root.left), this.height(root.right)) + 1;

        let balanceFactor = this.#getBalanceFactor(root);
        if (balanceFactor > 1) {
            if (this.#getBalanceFactor(root.left) >= 0) {
                return this.rightRotate(root);
            } else {
                root.left = this.leftRotate(root.left);
                return this.rightRotate(root);
            }
        }
        if (balanceFactor < -1) {
            if (this.#getBalanceFactor(root.right) <= 0) {
                return this.leftRotate(root);
            } else {
                root.right = this.rightRotate(root.right);
                return this.leftRotate(root);
            }
        }
        return root;
    };

    #findHelper(root: Node, item: string) {
        if (root == null) {
            return root;
        }

        if (item < root.item) {
            return this.#findHelper(root.left, item);
        } else if (item > root.item) {
            return this.#findHelper(root.right, item);
        }

        return root.item;
    }

    find(item: string) {
        const searchedItem = this.#findHelper(this.#root, item);
        return searchedItem;
    }

    //delete a node
    deleteNode = (item: string) => {
        this.#root = this.#deleteNodeHelper(this.#root, item);
    };

    // print the tree in pre - order
    preOrder = () => {
        this.#preOrderHelper(this.#root);
    };

    #preOrderHelper = (node: Node) => {
        if (node) {
            console.log(node.item);
            this.#preOrderHelper(node.left);
            this.#preOrderHelper(node.right);
        }
    };

    /**
     * @param {string} wordList
     */
    buildDictionary(wordList: string) {
        let wordStart = 0;
        for (let i = 0; i < wordList.length; i++) {
            const char = wordList[i];
            if (char === '\r' || char === '\n' || char === '\n') {
                if (i > wordStart) {
                    const word = wordList.substring(wordStart, i).toLowerCase();
                    this.insertNode(word);
                }
                wordStart = i + 1;
            }
        }
    }

    /**
     * @param {string} text
     */
    spellCheck(text: string) {
        let wordStart = 0;
        let spellChecked: string[] = [];
        const textLength = text.length;
        for (let i = 0; i < textLength; i++) {
            const char = text.charCodeAt(i);
            if (char < 65 || char > 122 || (char > 90 && char < 97)) {
                if (i > wordStart) {
                    const word = text.substring(wordStart, i).toLowerCase();
                    let found = false;

                    let searchedWord = this.find(word);
                    if (searchedWord) {
                        found = true;
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

export default BBST;
