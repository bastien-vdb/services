import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table"
import React from "react";

type TableMainProps = {
    caption: string,
    headers: { className: string, text: string | React.ReactNode, tooltip: string }[],
    rows: { className: string, text: string | React.ReactNode }[][],
}

function TableMain({ caption, headers, rows }: TableMainProps) {

    return (
        <Table key={caption}>
            <TableCaption>{caption}</TableCaption>
            <TableHeader>
                <TableRow>
                    {headers.map((header, key) => (
                        <TableHead title={header.tooltip} key={key} className={header.className}>{header.text}</TableHead>
                    ))}
                </TableRow>

            </TableHeader>
            <TableBody>
                {rows.map(row => (
                    <TableRow>
                        {row.map((cell, key) => (
                            <TableCell key={key} className={cell.className}>{cell.text}</TableCell>
                        ))}
                    </TableRow>
                ))}

            </TableBody>
        </Table>
    )
}

export default TableMain;