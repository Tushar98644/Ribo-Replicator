"use client"

import { Button } from "@/components/ui/button"
import axios from "axios"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react"
import { useRouter } from "next/navigation"


export const Tab = () => {
    
    const [excludedAminoAcids, setExcludedAminoAcids] = useState<string>();
    const [sequenceLength, setSequenceLength] = useState<number>();
    const [numberOfSequences, setNumberOfSequences] = useState<number>();
    const router = useRouter();

    const generateSequences = () => {
        const data = {
            excludedAminoAcids,
            sequenceLength,
            numberOfSequences
        };
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        axios.post('/api/generate_sequences', data , config)
            .then(response => {
                console.log(`The request was successful: ${response}`);
                router.push('/result');
            })
            .catch(error => {
                console.log(`There was an error sending the request: ${error}`)
            })
    }
    return (
        <Tabs defaultValue="account" className="w-[400px] px-6">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Text Input</TabsTrigger>
                <TabsTrigger value="password">File Input</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <Card>
                    <CardHeader>
                        <CardTitle>Generator</CardTitle>
                        <CardDescription>
                            List the amino acid sequences that you want to be excluded. Click Generate when you are done.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="name">Amino Acids(to be excluded)</Label>
                            <Input id="name" placeholder="A,K..."  value={excludedAminoAcids} onChange={e => setExcludedAminoAcids(e.target.value)}/>
                        </div>
                    </CardContent>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="name">Sequence Length</Label>
                            <Input id="name" type="number" placeholder="5" value={sequenceLength} onChange={e => setSequenceLength(parseInt(e.target.value))}/>
                        </div>
                    </CardContent>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="name">Number of Sequences</Label>
                            <Input id="name" type="number" placeholder="10" value={numberOfSequences} onChange={e=>setNumberOfSequences(parseInt(e.target.value))}/>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={generateSequences}>Generate</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="password">
                <Card>
                    <CardHeader>
                        <CardTitle>File Input</CardTitle>
                        <CardDescription>
                            Provide a txt file with the amino acid sequences that you want to be excluded , the sequence length and the number of sequences. Click Generate when you are done.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="current">Input</Label>
                            <Input id="current" type="file" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={generateSequences}>Generate</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
