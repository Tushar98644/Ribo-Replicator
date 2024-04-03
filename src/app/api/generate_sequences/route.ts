import random from "random";

interface storedParameters {
    sequenceLength: number;
    numberOfSequences: number;
    excludedAminoAcids: string;
}

interface AminoAcidCodes {
    [key: string]: string;
}

let storedParameters: storedParameters;

const aminoAcidThreeLetterCodes: AminoAcidCodes = {
    'A': 'Ala',
    'C': 'Cys',
    'D': 'Asp',
    'E': 'Glu',
    'F': 'Phe',
    'G': 'Gly',
    'H': 'His',
    'I': 'Ile',
    'K': 'Lys',
    'L': 'Leu',
    'M': 'Met',
    'N': 'Asn',
    'P': 'Pro',
    'Q': 'Gln',
    'R': 'Arg',
    'S': 'Ser',
    'T': 'Thr',
    'V': 'Val',
    'W': 'Trp',
    'Y': 'Tyr'
};

const generateRandomSequences = (
    sequenceLength: number,
    numberOfSequences: number,
    excluded_amino_acids: string
) => {
    const randomSequences = [];

    for (let n = 0; n < numberOfSequences; n++) {
        const randomSequence = generateRandomSequence(sequenceLength);
        randomSequences.push(randomSequence);
    }

    return randomSequences;
};

const generateRandomSequence = (
    sequenceLength: number,
    excluded_amino_acids: string[] = []
) => {
    const aminoAcids = [
        "A",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "K",
        "L",
        "M",
        "N",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "V",
        "W",
        "Y",
    ];
    let randomSequence = "";
    let entire_sequence = {};
    let ribContent = "title RIBOSOME\n";
    ribContent += "default helix\n";

    for (let i = 0; i < sequenceLength; i++) {
        const filteredAminoAcids = aminoAcids.filter(
            (acid) => !excluded_amino_acids.includes(acid)
        );

        const randomAminoAcid =
            filteredAminoAcids[
                random.int(0, filteredAminoAcids.length - 1)
            ].toUpperCase();
        randomSequence += randomAminoAcid;

        const threeLetterCode = aminoAcidThreeLetterCodes[randomAminoAcid];
        const code = threeLetterCode.toLowerCase();

        const phi_angle = random.float(-90, 90);
        const chi_angle = random.float(-90, 90);
        
        ribContent += `res ${code} phi ${phi_angle} psi ${chi_angle} \n`;
    }

    const phi = random.float(-90, 90);
    const chi = random.float(-90, 90);

    entire_sequence = {
        id: random.int(0, 10000),
        sequence: randomSequence,
        phi_angle: phi,
        chi_angle: chi,
        rib_content: ribContent,
    };

    console.log(ribContent);

    return entire_sequence;
};

export const POST = async (req: Request) => {
    try {
        const { excludedAminoAcids, sequenceLength, numberOfSequences } =
            await req.json();

        storedParameters = {
            excludedAminoAcids,
            sequenceLength,
            numberOfSequences,
        };
        console.log(
            `Excluded Amino Acids: ${excludedAminoAcids} and Sequence Length: ${sequenceLength} , Number of Sequences: ${numberOfSequences}`
        );

        return new Response("Success", { status: 200 });
    } catch (e) {
        console.log(`Error in POST request: ${e}`);
        return new Response("Error", { status: 500 });
    }
};


export const GET = async () => {
    try {
        const { excludedAminoAcids, sequenceLength, numberOfSequences } =
            storedParameters;
        const randomSequences = generateRandomSequences(
            sequenceLength,
            numberOfSequences,
            excludedAminoAcids
        );

        return new Response(JSON.stringify(randomSequences), { status: 200 });
    } catch (e) {
        console.log(`Error in GET request: ${e}`);
        return new Response("Error", { status: 500 });
    }
};
