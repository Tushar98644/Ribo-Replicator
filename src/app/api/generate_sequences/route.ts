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
    let ribContent = "title SEQUENCE\n \n";
    ribContent += "default helix\n \n";
    let pdbContent = "";

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
        const code = threeLetterCode.toUpperCase();

        const phi_angle = random.float(-90, 90);
        const chi_angle = random.float(-90, 90);
        
        const chainID = 'A'; // You can customize the chain ID as needed

        // Increment atom serial number for each new atom
        const atomSerial = i + 1;

        // Generate coordinates for the atoms
        const x = random.float(-30, 30).toFixed(3);
        const y = random.float(-30, 30).toFixed(3);
        const z = random.float(-30, 30).toFixed(3);

        ribContent += `res ${code} phi ${phi_angle.toFixed(2)} psi ${chi_angle.toFixed(2)} \n`;

        pdbContent += `ATOM  ${atomSerial.toString().padStart(5, ' ')} ${threeLetterCode.padEnd(4, ' ')} ${chainID}   ${i + 1}    ${x.padStart(8, ' ')}${y.padStart(8, ' ')}${z.padStart(8, ' ')}  1.00  0.00          ${threeLetterCode}\n`;
    }

    const phi = random.float(-90, 90);
    const chi = random.float(-90, 90);

    entire_sequence = {
        id: random.int(0, 10000),
        sequence: randomSequence,
        phi_angle: phi,
        chi_angle: chi,
        rib_content: ribContent,
        pdb_content: pdbContent,
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
