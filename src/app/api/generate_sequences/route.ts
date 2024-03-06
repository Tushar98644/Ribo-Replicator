import random from 'random';

interface storedParameters  {
    sequenceLength: number,
    numberOfSequences: number,
    excludedAminoAcids: string,
};

let storedParameters: storedParameters;

const generateRandomSequences = (sequenceLength: number, numberOfSequences: number, excluded_amino_acids: string) => {
    const randomSequences = [];
    
    for (let n = 0; n < numberOfSequences; n++) {
        const randomSequence = generateRandomSequence(sequenceLength);
        randomSequences.push(randomSequence);
    }
    
    return randomSequences;
}

const generateRandomSequence =(sequenceLength: number, excluded_amino_acids: string[] = []) => {
    const aminoAcids = ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y'];
    let randomSequence = '';
    let entire_sequence = {};
    
    for (let i = 0; i < sequenceLength; i++) {
        const filteredAminoAcids = aminoAcids.filter(acid => !excluded_amino_acids.includes(acid));
        
        const randomAminoAcid = filteredAminoAcids[random.int(0, filteredAminoAcids.length - 1)].toUpperCase();
        randomSequence += randomAminoAcid;
    }
    
    const phi = random.float(0, 360);
    const chi = random.float(0, 360);
    
    entire_sequence = {
        id: random.int(0, 1000),
        sequence: randomSequence,
        phi_angle: phi,
        chi_angle: chi
    }
    
    return entire_sequence;
}


export const POST = async (req: Request) => {
    try {
        const { excludedAminoAcids, sequenceLength, numberOfSequences } = await req.json();

         storedParameters = {
            excludedAminoAcids,
            sequenceLength,
            numberOfSequences
        };
        console.log(`Excluded Amino Acids: ${excludedAminoAcids} and Sequence Length: ${sequenceLength} , Number of Sequences: ${numberOfSequences}`);

        return new Response('Success', { status: 200 });
    } catch (e) {
        console.log(`Error in POST request: ${e}`);
        return new Response('Error', { status: 500 });
        
    }
};

export const GET = async () => {
    try {
        const { excludedAminoAcids,sequenceLength,numberOfSequences } = storedParameters;
        const randomSequences = generateRandomSequences(sequenceLength, numberOfSequences , excludedAminoAcids);

        return new Response(JSON.stringify(randomSequences), { status: 200 });
    }
    catch (e) {
        console.log(`Error in GET request: ${e}`);
        return new Response('Error', { status: 500 });
    }
}