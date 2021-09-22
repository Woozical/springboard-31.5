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

    // clean-up duplicates
    for (let key in this.chains){
      const arr = this.chains[key];
      this.chains[key] = [...new Set(arr)]
    }

  }


  /** return random text from chains */
  makeText(numWords = 100) {
    let count = 0;
    let output = [];
    let start = true;
    while (count < numWords){
      // Pick a random starting word
      if (start){
        // Look for words that include include punctuation
        const endingWords = Object.keys(this.chains).filter( (word) => {
          const lastChar = word[word.length-1];
          return (lastChar === '.' || lastChar === '!' || lastChar === '?');
        });
        let newWord;
        // Grab a random word if none applicable
        if (endingWords.length === 0){
          newWord = Object.keys(this.chains)[Math.trunc(Math.random() *  Object.keys(this.chains).length)];
        // Otherwise, grab a word in the markov chain of a sentence-ending word
        } else {
          const endWord = endingWords[Math.trunc(Math.random() * endingWords.length)];
          const availWords = this.chains[endWord];
          newWord = availWords[Math.trunc(Math.random() * availWords.length)];
        }
        output.push(newWord);
        start = false;
        count++;
      }
      else {
        const curWord = output[count-1];
        const availWords = this.chains[curWord];
        const newWord = availWords[Math.trunc(Math.random() * availWords.length)];
        // If word is null, no push, new starting word on next pass.
        if (newWord === null){
          start = true;
        } else {
          output.push(newWord);
          count++;
        }
      }
    }

    return output.join(' ');

  }

  // makeText(numWords = 100) {
  //   let count = 0;
  //   let wordCount = 0;
  //   let output = [];
  //   let start = true;
  //   while (wordCount < numWords){
  //     // Pick a random starting word
  //     if (start){
  //       const startWords = Object.keys(this.chains);
  //       const newWord = startWords[Math.trunc(Math.random() * startWords.length)];
  //       output.push(
  //         newWord[0].toUpperCase() + newWord.substring(1)
  //       );
  //       start = false;
  //       wordCount++;
  //     }
  //     // Pick a random following word.
  //     else {
  //       const curWord = output[count - 1];
  //       let availWords;
  //       if (!Object.keys(this.chains).includes(curWord)){
  //         availWords = this.chains[curWord.toLowerCase()];
  //       } else {
  //         availWords = this.chains[curWord];
  //       }
  //       const newWord = availWords[Math.trunc(Math.random() * availWords.length)];
  //       // If word is null, punctuate, new starting word on next pass.
  //       if (newWord === null){
  //         output.push('.');
  //         start = true;
  //       } else {
  //         output.push(newWord);
  //         wordCount++;
  //       }
  //     }
  //     count++;
  //   }
  //   return output.join(' ').replace(/ \. /g, '. ').trim();
  // }
}
module.exports = MarkovMachine;
