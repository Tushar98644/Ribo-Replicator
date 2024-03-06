import { Button } from "@/components/ui/button"
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

export const Tab = () => {
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
              <Input id="name" placeholder="A,K..."/>
            </div>
          </CardContent>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Sequence Length</Label>
              <Input id="name" placeholder="5"/>
            </div>
          </CardContent>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Number of Sequences</Label>
              <Input id="name" placeholder="10"/>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Generate</Button>
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
            <Button>Generate</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
