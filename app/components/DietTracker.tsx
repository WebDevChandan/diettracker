"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AllCommunityModule, ColDef, GridApi, ModuleRegistry, RowSelectionOptions, themeQuartz, ValidationModule } from 'ag-grid-community';
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../styles.css";
import ManageItem from "./ManageItem";
import { DietType } from "@/types/Diet";
import useDialog from "@/hooks/useDialog";
import ManageItemProvider from "../context/ManageItemProvider";
import { FoodItemType } from "@/types/FoodItem";

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

    const calcNutrientPerAmntOfWght = useCallback(
        (p: any, currValue: number) => {
            if (p.data.name !== "Total") {
                return parseFloat(((currValue / p.data.amountPer) * p.data.currentWeight).toFixed(3));
            }
        },
        []
    );

    const FoodItemComponent = useCallback(
        (p: any) => {
            const itemFixedNutrientValue = diet.find((item) => item.name === p.data.name);
            if (!itemFixedNutrientValue)
                return;

            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <div style={{ cursor: "pointer" }}>{p.value}</div>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Item for {itemFixedNutrientValue?.category.name}</DialogTitle>
                            <DialogDescription>Delete or Update Item as <b>Amount Per (g)</b> </DialogDescription>
                        </DialogHeader>
                        <ManageItemProvider itemToManage={itemFixedNutrientValue} >
                            <ManageItem isNewItem={false} currentCategory={itemFixedNutrientValue.category.name} />
                        </ManageItemProvider>
                    </DialogContent>
                </Dialog>
            );
        },
        [diet]
    );

    const TotalComponent = useCallback(
        (p: any) => {
            return (
                p.data.name !== "Total"
                    ? <div style={{ cursor: "pointer" }}>{p.value}</div>
                    : <div style={{ cursor: "pointer" }}>totalSum</div>
            );
        },
        [diet]
    );

    const [rowData, setRowData] = useState<DietType>([]);

    useEffect(() => {
        setRowData([...diet]);
    }, [diet]);

    const colDefs = useMemo(
        () => [
            {
                field: "name",
                headerName: "Food Items",
                cellRenderer: FoodItemComponent,
                filter: true,
                cellDataType: "text",
                sortable: false,
                minWidth: 150,
            },
            {
                field: "currentWeight",
                headerName: "Add Weight (g)",
                // cellRenderer: TotalComponent,
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
                cellRenderer: TotalComponent,
                valueFormatter: (p: any) => p.value?.toLocaleString() + " g",
                filter: null,
            },
        ],
        [calcNutrientPerAmntOfWght, FoodItemComponent, TotalComponent]
    );


    const getTotal = () => {
        setRowData([...rowData, {
            name: "sdf",
            currentWeight: rowData.reduce((acc, curr) => acc + curr.currentWeight, 0),
            calories: rowData.reduce((acc, curr) => acc + curr.calories, 0),
            protein: rowData.reduce((acc, curr) => acc + curr.protein, 0),
            carbs: rowData.reduce((acc, curr) => acc + curr.carbs, 0),
            fat: rowData.reduce((acc, curr) => acc + curr.fat, 0),
            sugar: rowData.reduce((acc, curr) => acc + curr.sugar, 0),
            amountPer: 0,
            category: {
                name: `${diet[0].category.name}`,
            }
        }]);
        console.log(rowData);
    }


    return (
        <div
            id="myGrid"
            className="ag-theme-quartz"
            style={gridStyle}
        >
            {/* <Button className="mr-2" onClick={getTotal}>Get Total</Button> */}
            <AgGridReact
                defaultColDef={defaultColDef}
                theme={themeQuartz}
                ref={gridRef}
                rowData={[...rowData,
                    // {
                    //     name: "Total",
                    //     currentWeight: 0,
                    //     calories: 0,
                    //     protein: 0,
                    //     carbs: 0,
                    //     fat: 0,
                    //     sugar: 0,
                    //     amountPer: 0,
                    //     category: {
                    //         name: `${diet[0].category.name}`,
                    //     }
                    // }
                ]}
                columnDefs={colDefs}
                groupDefaultExpanded={1}
            />
        </div>
    )
}
