/** Textual markov chain generator */

class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    this.chains = {};
    this.words.forEach( (val, idx) => {
      const newWord = this.words[idx+1] ? this.words[idx+1] : null;
      if (this.chains[val]){
        const arr = this.chains[val];
        arr.push(newWord);
        this.chains[val] = arr;
      } else {
        this.chains[val] = [newWord];
      }
    });
  }


  /** return random text from chains */

  makeText(numWords = 100) {
    let count = 0;
    let wordCount = 0;
    let output = [];
    let start = true;
    while (wordCount < numWords){
      // Pick a random starting word
      if (start){
        const startWords = Object.keys(this.chains);
        const newWord = startWords[Math.trunc(Math.random() * startWords.length)];
        output.push(
          newWord[0].toUpperCase() + newWord.substring(1)
        );
        start = false;
        wordCount++;
      }
      // Pick a random following word.
      else {
        const curWord = output[count - 1];
        let availWords;
        if (!Object.keys(this.chains).includes(curWord)){
          console.log(curWord);
          availWords = this.chains[curWord.toLowerCase()];
        } else {
          availWords = this.chains[curWord];
        }
        const newWord = availWords[Math.trunc(Math.random() * availWords.length)];
        // If word is null, punctuate, new starting word on next pass.
        if (newWord === null){
          output.push('.');
          start = true;
        } else {
          output.push(newWord);
          wordCount++;
        }
      }
      count++;
    }
    return output.join(' ').replace(/ \. /g, '. ').trim();
  }
}

module.exports = MarkovMachine;
