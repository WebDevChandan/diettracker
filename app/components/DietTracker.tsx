"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AllCommunityModule, ColDef, ModuleRegistry, RowSelectionOptions, themeQuartz, ValidationModule } from 'ag-grid-community';
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../styles.css";
import ManageItem from "./ManageItem";
import { DietType } from "@/types/Diet";

ModuleRegistry.registerModules([AllCommunityModule, ValidationModule]);

export default function DietTracker({ diet }: { diet: DietType }) {
    const gridRef = useRef<AgGridReact>(null);
    const gridStyle = useMemo(() => ({ height: "300px", width: "100%", outline: "none", border: "none" }), []);

    const defaultColDef = useMemo(() => {
        return {
            filter: "agTextColumnFilter",
            flex: 1,
            minWidth: 100,
            enableCellChangeFlash: true,
        };
    }, []);

    const rowSelection = useMemo<RowSelectionOptions | "single" | "multiple">(() => {
        return {
            mode: "multiRow",
            headerCheckbox: false,
        };
    }, []);

    const calcNutrientPerAmntOfWght = useCallback(
        (p: any, currValue: number) => {
            if (p.data.name !== "Total") {
                return parseFloat(((currValue / p.data.amountPer) * p.data.currentWeight).toFixed(3));
            }
        },
        []
    );

    const MyCellComponent = useCallback(
        (p: any) => {
            const itemFixedNutrientValue = diet.find((item) => item.name === p.data.name);

            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <div style={{ cursor: "pointer" }}>{p.value}</div>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Item</DialogTitle>
                            <DialogDescription>Update or Delete Item from {itemFixedNutrientValue?.category.name}</DialogDescription>
                        </DialogHeader>
                        <ManageItem isNewItem={false} itemFixedNutrientValue={itemFixedNutrientValue} />
                    </DialogContent>
                </Dialog>
            );
        },
        [diet]
    );


    const colDefs = useMemo(
        () => [
            {
                field: "name",
                headerName: "Food Items",
                cellRenderer: MyCellComponent,
                filter: true,
                cellDataType: "text",
                sortable: false,
                minWidth: 150,
            },
            {
                field: "currentWeight",
                headerName: "Add Weight (g)",
                editable: (p: any) => p.data.name !== "Total",
                valueFormatter: (p: any) => p.value?.toLocaleString() + " g",
                filter: null,
            },
            {
                field: "calories",
                headerName: "Calories",
                valueGetter: (p: any) => calcNutrientPerAmntOfWght(p, p.data.calories),
            },
            {
                field: "protein",
                headerName: "Protein",
                valueGetter: (p: any) => calcNutrientPerAmntOfWght(p, p.data.protein),
            },
            {
                field: "carbs",
                headerName: "Carbs",
                valueGetter: (p: any) => calcNutrientPerAmntOfWght(p, p.data.carbs),
            },
            {
                field: "fat",
                headerName: "Fat",
                valueGetter: (p: any) => calcNutrientPerAmntOfWght(p, p.data.fat),
            },
            {
                field: "sugar",
                headerName: "Sugar",
                valueGetter: (p: any) => calcNutrientPerAmntOfWght(p, p.data.sugar),
            },
            {
                field: "amountPer",
                headerName: "Amount Per",
                valueFormatter: (p: any) => p.value?.toLocaleString() + " g",
                filter: null,
            },
        ],
        [calcNutrientPerAmntOfWght, MyCellComponent]
    );

    return (
        <div
            id="myGrid"
            className="ag-theme-quartz"
            style={gridStyle}
        >
            <AgGridReact
                defaultColDef={defaultColDef}
                theme={themeQuartz}
                ref={gridRef}
                rowData={diet}
                columnDefs={colDefs}
                rowSelection={rowSelection}
                groupDefaultExpanded={1}
            />
        </div>
    )
}
