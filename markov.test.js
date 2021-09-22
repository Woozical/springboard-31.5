const MarkovMachine = require('./markov');

describe('should set up markov chains', ()=>{
    test('the cat in the hat', ()=>{
        const machine = new MarkovMachine('the cat in the hat');
        expect(machine.chains).toEqual(
            {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]}
        );
    });
    test('red cats run long and run far', ()=>{
        const newMachine = new MarkovMachine('red cats run long and run far');
        expect(newMachine.chains).toEqual(
            {red: ['cats'], cats: ['run'], run: ['long', 'far'], long:['and'], and:['run'], far:[null]}
        );
    });
})

describe('should generate appropriate text', ()=>{
    let machine;
    beforeEach( ()=> {
        machine = new MarkovMachine('red cats run long and run far');
    });

    test('text length should be 100 words by default', ()=>{
        let text = machine.makeText();
        const arr = text.split(' ');

        expect(arr.length).toEqual(100);
    });

    test('variable text length', ()=>{
        let text = machine.makeText(50);
        const arr = text.split(' ');
        expect(arr.length).toEqual(50);
    });

    test('text follows chains', ()=> {
        let text = machine.makeText();
        const arr = text.split(' ');

        for (let idx = 0; idx < arr.length; idx++){
            const word = arr[idx]
            const chain = machine.chains[word];
            const nextWord = arr[idx + 1];

            if (nextWord && !chain.includes(null)){
                // If there is a next word, it should be in the current words markov chain
                expect(chain).toContain(nextWord);
            }
        }
    });

})