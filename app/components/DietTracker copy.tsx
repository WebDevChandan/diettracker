"use client";
import { AgGridReact } from "ag-grid-react"
import { AllCommunityModule, ModuleRegistry, ColDef, RowSelectionOptions, GridState, themeBalham, themeAlpine, themeQuartz, CellClassRules } from 'ag-grid-community';
import { useMemo, useState } from "react";
import "../styles.css";
import { AllDietType } from "@/types/Diet";

ModuleRegistry.registerModules([AllCommunityModule]);

const cellClassRules: CellClassRules = {
    // apply green to electric cars
    "rag-green": (params) => params.value === true,
};

const MyyCellComponent = ({ value }: any) => {
    return <div style={{ fontWeight: value ? "bold" : "normal" }}>{value}</div>;
}
export default function DietTracker({ diet }: { diet: AllDietType }) {
    const containerStyle = useMemo(() => ({ width: "100%", minheight: "100vh" }), []);
    const gridStyle = useMemo(() => ({ height: "500px", width: "100%", outline: "none", border: "none" }), []);

    // Here useMemo can be used to set the default behaviour of the whole table
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            filter: "agTextColumnFilter",
            // floatingFilter: true,
        };
    }, []);

    const rowSelection = useMemo<RowSelectionOptions | "single" | "multiple">(() => {
        return {
            mode: "multiRow",
            headerCheckbox: false,
        };
    }, []);

    const rowClassRules = useMemo(() => ({
        'red-row': (p: any) => p.data.make === "Toyota"
    }), []);


    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState<ColDef[]>([
        {
            field: "make",
            cellRenderer: MyyCellComponent,
            filter: true,
            editable: true,
            cellDataType: 'text',
            sortable: false
        },
        {
            field: "model",
            minWidth: 250
        },
        {
            field: "price", editable: true,
            valueFormatter: p => "$ " + p.value.toLocaleString()
        },
        { field: "electric", cellClassRules: cellClassRules, editable: true },
        {
            headerName: "Total",
            valueGetter: "data.price + 1",
            editable: false,
            enableCellChangeFlash: true,
        },
    ]);

    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([
        { make: "Tesla", model: "Model Y", price: 64950, electric: true, },
        { make: "Ford", model: "F-Series", price: 33850, electric: false, },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    ]);


    return (
        <div
            className="ag-theme-quartz"

            style={gridStyle}
        >
            <AgGridReact
                defaultColDef={defaultColDef}
                theme={themeQuartz}
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 20]}
                rowData={rowData}
                columnDefs={colDefs}
                rowSelection={rowSelection}
                rowClassRules={rowClassRules}
                groupDefaultExpanded={1}
            />
        </div>
    )
}
