// Copyright (c) 2012-2024 John Nesky and contributing authors, distributed under the MIT license.

/**
 * Empties all children from a DOM/SVG node without detaching it from the DOM tree.
 */
export function emptyElement<T extends Node>(node: T): T {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
    return node;
}

/**
 * Clones a node shallowly and replaces the original node in its parent.
 */
export function makeEmptyReplacementElement<T extends Node>(node: T): T {
    if (node.parentNode) {
        const clone: T = <T>node.cloneNode(false);
        node.parentNode.replaceChild(clone, node);
        return clone;
    }
    return emptyElement(node);
}
