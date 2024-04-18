"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import axios from "axios"
import { useRouter } from "next/navigation"

export type Sequence = {
  id: number
  sequence: string
  phi_angle: number
  chi_angle: number
  rib_content: string
  pdb_content: string
}

const generate_rib = async (rib_content: any) => {
  try {
    const blob = new Blob([rib_content], { type: 'application/octet-stream' });

    // Create a URL for the Blob object
    const url = window.URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'output.rib');

    // Append the link to the document body and click it programmatically
    document.body.appendChild(link);
    link.click();

    // Clean up by removing the link and revoking the URL
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    console.log("Rib file generated")
  }
  catch (e) {
    console.log(`Error in generating rib file: ${e}`)
  }
}

const generate_pdb = async (pdb_content: any) => {

  try {
    const blob = new Blob([pdb_content], { type: 'application/octet-stream' });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'output.pdb');

    // Append the link to the document body and click it programmatically
    document.body.appendChild(link);
    link.click();

    // Clean up by removing the link and revoking the URL
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    console.log("Pdb file generated");
  }
  catch (e) {
    console.log(`Error in generating pdb file: ${e}`)
  }
}

export const DataTable = () => {
  const router = useRouter();
  const [sequences, setSequences] = useState([]);
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({});
  const [energy_details , setEnergyDetails] = useState({} as any);

  const generate3DView = async (pdb_content: any) => {
    try {
      console.log(`The data sent to api is ${pdb_content}`);
      const data = {
        pdb_content: pdb_content
      };
      console.log(`The data sent to generate_view api is ${data}`);
      await axios.post('/api/generate_view', data, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => {
          if (response.status !== 200) {
            throw new Error(`Failed to load PDB: ${response.statusText}`);
          }
          console.log(`Loaded PDB data successfully. The recieved data is ${response.data}`);
          router.push('/viewer');
          return response.data;
        }
        )
        .catch(error => {
          console.log(`There was an error sending the Post request: ${error}`)
        })
    } catch (error) {
      console.error(`Failed to load PDB: ${error}`);
    }
  };

  const energy_minimization = async (pdb_content: any) => {
    try {
      console.log(`The data sent to api is ${pdb_content}`);
      const data = {
        pdb_content: pdb_content
      };
      console.log(`The data sent to generate_view api is ${data}`);
      await axios.post('/api/energy_minimizer', data, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => {
          if (response.status !== 200) {
            throw new Error(`Failed to load PDB: ${response.statusText}`);
          }
          console.log(`The data recieved from the energy minimizer api is: ${response.data}`)
          setEnergyDetails(response.data);
          return response.data;
        }
        )
        .catch(error => {
          console.log(`There was an error sending the Post request: ${error}`)
        })
    } catch (error) {
      console.error(`Failed to load PDB: ${error}`);
    }
  }

  const columns: ColumnDef<Sequence>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "sequence",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sequence
            <CaretSortIcon className="" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="uppercase ml-4">{row.getValue("sequence")}</div>,
    },
    {
      accessorKey: "phi_angle",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Phi Angle
            <CaretSortIcon className="h-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("phi_angle")}</div>,
    },
    {
      accessorKey: "chi_angle",
      header: () => <div className="text-right">Chi Angle</div>,
      cell: ({ row }) => {
        const chi_angle = parseFloat(row.getValue("chi_angle"))

        return <div className="text-right font-medium">{chi_angle}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const sequence = row.original;
        console.log(`The pdb content is: ${sequence.pdb_content}`)

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(sequence.sequence)}
              >
                Copy sequence
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => generate_rib(sequence.rib_content)}>Download Rib file</DropdownMenuItem>
              <DropdownMenuItem onClick={() => generate_pdb(sequence.pdb_content)}>Download Pdb file</DropdownMenuItem>
              <DropdownMenuItem onClick={() => generate3DView(sequence.pdb_content)}>3D visualization</DropdownMenuItem>
              <DropdownMenuItem onClick={() => energy_minimization(sequence.pdb_content)}>Energy Minimization</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: sequences,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get('/api/generate_sequences')
          .then(data => {
            console.log(`The list of generated random sequences : ${data.data}`)
            setSequences(data.data);
          })
          .catch(error => {
            console.log(`There was an error sending the Get request: ${error}`)
          })
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full md:px-12 px-2 pb-10">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Amino Acids..."
          value={(table.getColumn("sequence")?.getFilterValue() as string) ?? ""}
          onChange={(event: { target: { value: any } }) =>
            table.getColumn("sequence")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: any) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
