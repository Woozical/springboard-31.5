const fs = require('fs');
const axios = require('axios');
const MarkovMachine = require('./markov');

function getFileText(path){
    let data
    try{
        data = fs.readFileSync(path, 'utf8');
        return data;
    } catch (err) {
        console.log('ERROR:', err.message);
        process.exit(1);
    }
}

function getURLText(url){
    return new Promise( (resolve, reject) => {
        axios.get(url)
        .then( (response) => {
            resolve (response.data);
        })
        .catch( (err) => {
            console.log('ERROR:', err.message);
            process.exit(1);
        })  
    })
}

async function execute(){
    let text;

    switch(process.argv[2]){
        case 'file':
            text = getFileText(process.argv[3]);
            break;
        case 'url':
            text = await getURLText(process.argv[3]);
            break;
        default:
            console.log(`Unrecognized argument: ${process.argv[2]}. Command line argument should be 'file' or 'url'.\n
            E.g.: node makeText.js file my_file.txt`);
            process.exit(1);
    }
    // console.log(text);
    const mm = new MarkovMachine(text);
    console.log(mm.makeText());
}

execute();