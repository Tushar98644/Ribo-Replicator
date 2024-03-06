import random from 'random';

export const POST = async (req: Request) => {
    try {
        const { excluded_amino_acids, sequence_length, number } = await req.json();
        console.log(`Excluded Amino Acids: ${excluded_amino_acids} and Sequence Length: ${sequence_length}`);

        const randomSequences = generateRandomSequences(sequence_length, number , excluded_amino_acids);

        return new Response(JSON.stringify(randomSequences), { status: 200 });
    } catch (e) {
        console.log(`Error in POST request: ${e}`);
        return new Response('Error', { status: 500 });
        
    }
};

function generateRandomSequences(sequenceLength: number, numberOfSequences: number, excluded_amino_acids: string[] = []) {
    const randomSequences = [];

    for (let n = 0; n < numberOfSequences; n++) {
        const randomSequence = generateRandomSequence(sequenceLength);
        randomSequences.push(randomSequence);
    }

    return randomSequences;
}

function generateRandomSequence(sequenceLength: number, excluded_amino_acids: string[] = []) {
    const aminoAcids = ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y'];
    let randomSequence = '';

    for (let i = 0; i < sequenceLength; i++) {
        const filteredAminoAcids = aminoAcids.filter(acid => !excluded_amino_acids.includes(acid));

        const randomAminoAcid = filteredAminoAcids[random.int(0, filteredAminoAcids.length - 1)].toUpperCase();

        randomSequence += randomAminoAcid;
    }
    return randomSequence;
}
