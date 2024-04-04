interface storedParameters {
  pdb_content: any;
}

let stored_data: storedParameters;

export const POST = async (req: Request) => {
  const { pdb_content } = await req.json();
  try {
    stored_data = { pdb_content };
    console.log(`The stored data is: ${stored_data}`);
    console.log(`PDB Content recieved by api: ${pdb_content}`);
    return new Response("Success", { status: 200 });
  } catch (e) {
    console.log(`Error in POST request: ${e}`);
    return new Response("Error", { status: 500 });
  }
};

export const GET = async () => {
  try {
    console.log(`PDB Content sent by api: ${stored_data}`);
    return new Response(JSON.stringify(stored_data), { status: 200 });
  } catch (e) {
    console.log(`Error in GET request: ${e}`);
    return new Response("Error", { status: 500 });
  }
};
