function RandomizeTiles(tilesNumber) {
    // Builds the initial shufflebag
    let bag = [];
    for (let i = 0; i < tilesNumber; i++) {
        bag.push(i);
    }

    let result = [];

    // Go crazy~
    while (bag.length > 0) {
        result.push(
            bag.splice(Math.floor(Math.random() * bag.length), 1)[0]
        );
    }

    return result;
}

export default RandomizeTiles;