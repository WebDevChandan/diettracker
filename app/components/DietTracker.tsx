"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AllDietType } from "@/types/Diet";
import { AllCommunityModule, ColDef, ModuleRegistry, RowSelectionOptions, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef, useState } from "react";
import "../styles.css";
import ManageItem from "./ManageItem";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function DietTracker({ diet }: { diet: AllDietType }) {
    const gridRef = useRef<AgGridReact>(null);
    const gridStyle = useMemo(() => ({ height: "300px", width: "100%", outline: "none", border: "none" }), []);
    const [rowData, setRowData] = useState([...diet]);

    const defaultColDef = useMemo<ColDef>(() => {
        return {
            filter: "agTextColumnFilter",
            flex: 1,
            // floatingFilter: true,
            enableCellChangeFlash: true,
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

    const calcNutrientPerAmntOfWght = (p: any, currValue: number) => {

        if (p.data.food_item !== "Total")
            return parseFloat(((currValue / p.data.amount_per) * p.data.current_weight).toFixed(3));
    };

    const MyyCellComponent = (p: any) => {
        const itemFixedNutrientValue = diet.find((diet) => diet.food_item === p.data.food_item);

        return (
            <Dialog>
                <DialogTrigger asChild>
                    <div style={{ cursor: "pointer" }}>{p.value}</div>

                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Item</DialogTitle>
                        <DialogDescription>
                            Edit Item for Breakfast
                        </DialogDescription>
                    </DialogHeader>
                    <ManageItem isNewItem={false} itemFixedNutrientValue={itemFixedNutrientValue} />
                    <DialogFooter>
                        <Button type="submit">Add Item</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    const [colDefs, setColDefs] = useState<ColDef[]>([
        {
            field: "food_item",
            headerName: "Food Items",
            cellRenderer: MyyCellComponent,
            filter: true,
            cellDataType: 'text',
            sortable: false,
        },
        {
            field: "current_weight",
            headerName: "Add Weight (g)",
            editable: p => p.data.food_item !== "Total" ? true : false,
            valueFormatter: p => p.value?.toLocaleString() + " g",
            filter: null,
        },
        {
            field: "calories",
            headerName: "Calories",
            valueGetter: (p) => calcNutrientPerAmntOfWght(p, p.data.calories),
            type: "number",
        },
        {
            field: "protein",
            headerName: "Protein",
            valueGetter: (p) => calcNutrientPerAmntOfWght(p, p.data.protein),
            type: "number",
        },
        {
            field: "carbs",
            headerName: "Carbs",
            valueGetter: (p) => calcNutrientPerAmntOfWght(p, p.data.carbs),
            type: "number",
        },
        {
            field: "fat",
            headerName: "Fat",
            valueGetter: (p) => calcNutrientPerAmntOfWght(p, p.data.fat),
            type: "number",
        },
        {
            field: "sugar",
            headerName: "Sugar",
            valueGetter: (p) => calcNutrientPerAmntOfWght(p, p.data.sugar),
            type: "number",
        },
        {
            field: "amount_per",
            headerName: "Amount Per",
            valueFormatter: p => p.value?.toLocaleString() + " g",
            type: "number",
            filter: null,
        },
    ]);

    return (
        <div
            className="ag-theme-quartz"
            style={gridStyle}
        >
            <AgGridReact
                defaultColDef={defaultColDef}
                theme={themeQuartz}
                ref={gridRef}
                rowData={rowData}
                columnDefs={colDefs}
                rowSelection={rowSelection}
                rowClassRules={rowClassRules}
                groupDefaultExpanded={1}
            />
        </div>
    )
}
