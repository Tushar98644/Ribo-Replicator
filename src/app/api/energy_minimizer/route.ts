import { promisify } from "util";
import fs from "fs";

const execAsync = promisify(require("child_process").exec);

interface storedParameters {
  pdb_content: any;
}

let stored_data: storedParameters;

export const POST = async (req: Request) => {
  const { pdb_content } = await req.json();
  if (!pdb_content) {
    console.log("Error: PDB Content is missing");
    return new Response("Error: PDB Content is missing", { status: 400 });
  }
  try {
    stored_data = { pdb_content };
    console.log(`The stored data is: ${stored_data.pdb_content}`);
    return new Response("Success", { status: 200 });
  } catch (e) {
    console.log(`Error in POST request: ${e}`);
    return new Response("Error", { status: 500 });
  }
};

export const GET = async (req: Request) => {
  const { pdb_content } = await req.json();
  try {
    if (typeof stored_data.pdb_content === "undefined") {
      console.log("PDB Content is undefined");
      return new Response("Error: PDB Content is undefined", { status: 500 });
    }
    console.log(`PDB Content sent to energy_minimizer api is:`, stored_data.pdb_content);
    const path = `./src/components/energy/energy.pdb`;
    fs.writeFileSync(path, stored_data.pdb_content);
    const command = `
    gmx pdb2gmx -f ${path} -o ${path}/trp_processed.gro -water spce -ignh &&
    gmx editconf -f ${path}/trp_processed.gro -o ${path}/trp_newbox.gro -c -d 1.0 -bt cubic &&
    gmx solvate -cp ${path}/trp_newbox.gro -cs spc216.gro -o ${path}/trp_solv.gro -p topol.top &&
    gmx grompp -f ions.mdp -c ${path}/trp_solv.gro -p topol.top -o ${path}/ions.tpr &&
    gmx grompp -f minim.mdp -c ${path}/trp_solv.gro -p topol.top -o ${path}/em.tpr -maxwarn 3 &&
    gmx mdrun -v -deffnm ${path}/em
  `;
    try {
      await execAsync(command);
    } catch (error) {
      console.error(`Error executing Ribosome: ${error}`);
      return;
    }

    return new Response(JSON.stringify(pdb_content), {
      status: 200,
    });
  } catch (e) {
    console.log(`Error in GET request: ${e}`);
    return new Response("Error", { status: 500 });
  }
};
