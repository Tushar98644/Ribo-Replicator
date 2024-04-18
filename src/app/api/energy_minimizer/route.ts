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
    console.log(
      `The stored data in the energy_minimizer api is: ${stored_data.pdb_content}`
    );
    return new Response("Success", { status: 200 });
  } catch (e) {
    console.log(`Error in POST request: ${e}`);
    return new Response("Error", { status: 500 });
  }
};

let energy_data: any;

export const GET = async () => {
  try {
    if (typeof stored_data.pdb_content === "undefined") {
      console.log("PDB Content is undefined");
      return new Response("Error: PDB Content is undefined", { status: 500 });
    }
    console.log(
      `PDB Content sent to energy_minimizer api is:`,
      stored_data.pdb_content
    );
    const file_path = `./new.pdb`;
    fs.writeFileSync(file_path, stored_data.pdb_content);

    const command1 = `echo "9" | gmx pdb2gmx -f new.pdb -o trp_processed.gro -water spce -ignh`;
    const command2 = `gmx editconf -f trp_processed.gro -o trp_newbox.gro -c -d 1.0 -bt cubic`;
    await execAsync(command1);
    await execAsync(command2);
    await execAsync(`gmx solvate -cp trp_newbox.gro -cs spc216.gro -o trp_solv.gro -p topol.top`);
    await execAsync(`gmx grompp -f ions.mdp -c trp_solv.gro -p topol.top -o ions.tpr -maxwarn 3`);
    await execAsync(`gmx grompp -f minim.mdp -c trp_solv.gro -p topol.top -o em.tpr -maxwarn 3`);
    await execAsync(`gmx mdrun -v -deffnm em`);
    // const energy_details = fs.readFileSync(`/trp_processed.gro`);
    // energy_data += energy_details;
    //   fs.unlinkSync(`/em.tpr`);

    // if (energy_data) {
    //   return new Response(JSON.stringify(energy_data), { status: 200 });
    // } else {
    //   return new Response("Error: Energy Data is missing", { status: 500 });
    // }

    return new Response("Success", { status: 200 });

  } catch (e) {
    console.log(`Error in GET request: ${e}`);
    return new Response("Error", { status: 500 });
  }
};
