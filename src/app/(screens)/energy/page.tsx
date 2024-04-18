"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const EnergyDetails = () => {

    const [energy_details, setEnergyDetails] = useState();

    useEffect(() => {
      const getData = async () =>{
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            await axios.get('/api/energy_minimizer', config)
                .then((response) => {
                    console.log(response.data);
                    setEnergyDetails(response.data);
                }
                )
                .catch((error) => {
                    console.log(`Error in GET request: ${error}`);
                });
        }
        catch (e) {
            console.log(`Error in GET request: ${e}`);
        }
      }
      getData();
    }
    , []);
    return (
        <div className="flex h-screen w-screen">
            <h1>energy minimizer</h1>
            {
                energy_details ? (
                    <div>
                        <h1>{energy_details}</h1>
                    </div>
                )
                    :
                    (
                        <div>
                            <h1>loading...</h1>
                        </div>
                    )
            }
        </div>
    );
}

export default EnergyDetails;