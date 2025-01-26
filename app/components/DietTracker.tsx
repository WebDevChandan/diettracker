"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DietType } from "@/types/Diet";
import { AllCategory } from "@prisma/client";
import { AllCommunityModule, ModuleRegistry, themeQuartz, ValidationModule } from 'ag-grid-community';
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import ManageItemProvider from "../context/ManageItemProvider";
import "../styles.css";
import ManageItem from "./ManageItem";

ModuleRegistry.registerModules([AllCommunityModule, ValidationModule]);

export default function DietTracker({ diet }: { diet: DietType }) {
    const gridRef = useRef<AgGridReact>(null);
    const gridStyle = useMemo(() => ({ height: "300px", width: "100%", outline: "none", border: "none" }), []);

    const defaultColDef = useMemo(() => {
        return {
            filter: null,
            flex: 1,
            minWidth: 100,
            enableCellChangeFlash: true,
        };
    }, []);

    const calNutrientFormula = (nutrientValue: number, amountPer: number, currentWeight: number) => parseFloat(((nutrientValue / amountPer) * currentWeight).toFixed(3));

    const calcNutrientPerAmntOfWght = useCallback(
        (p: any, currValue: number) => {
            if (p.data.currentWeight > 2000)
                return toast.info("Maximum 2kg limit exceeded");

            if (p.data.name.trim().toLocaleLowerCase() !== "SubTotal".toLocaleLowerCase()) {
                return calNutrientFormula(currValue, p.data.amountPer, p.data.currentWeight);

            } else
                return currValue;
        },
        []
    );

    const FoodItemComponent = useCallback(
        (p: any) => {
            const itemFixedNutrientValue = diet.find((item) => item.name === p.data.name);
            if (!itemFixedNutrientValue)
                return <div style={{ fontWeight: "500" }}>{p.value}</div>

            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <div style={{ cursor: "pointer", fontWeight: "500", color: "#181D1F" }}>{p.value}</div>
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

    const rowClassRules = useMemo(() => ({
        'bg-gray-800 text-white': (p: any) => p.data.name.trim().toLocaleLowerCase() === "SubTotal".toLocaleLowerCase()
    }), []);

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
        if (diet.length === 0) return;

        const total = {
            name: "SubTotal",
            currentWeight: diet.reduce((acc, curr) => acc + curr.currentWeight, 0),
            calories: diet.reduce((acc, curr) => acc + calNutrientFormula(curr.calories, curr.amountPer, curr.currentWeight), 0),
            protein: diet.reduce((acc, curr) => acc + calNutrientFormula(curr.protein, curr.amountPer, curr.currentWeight), 0),
            carbs: diet.reduce((acc, curr) => acc + calNutrientFormula(curr.carbs, curr.amountPer, curr.currentWeight), 0),
            fat: diet.reduce((acc, curr) => acc + calNutrientFormula(curr.fat, curr.amountPer, curr.currentWeight), 0),
            sugar: diet.reduce((acc, curr) => acc + calNutrientFormula(curr.sugar, curr.amountPer, curr.currentWeight), 0),
            amountPer: 0,
            category: {
                name: `${diet[0].category.name}` as AllCategory,
            }
        };
        setRowData([...diet, total]);
    }, [diet]);

    const colDefs = useMemo(
        () => [
            {
                field: "name",
                headerName: "Food Items",
                cellRenderer: FoodItemComponent,
                cellDataType: "text",
                sortable: false,
                minWidth: 150,
                filter: "agTextColumnFilter",
            },
            {
                field: "currentWeight",
                headerName: "Add Weight (g)",
                // cellRenderer: TotalComponent,
                // editable: (p: any) => p.data.name !== "Total",
                valueFormatter: (p: any) => p.value <= 2000 ? `${p.value?.toLocaleString()} g` : `${2000} g`,
            },
            {
                field: "calories",
                headerName: "Calories (g)",
                valueFormatter: (p: any) => `${calcNutrientPerAmntOfWght(p, p.data.calories)} g`,
            },
            {
                field: "protein",
                headerName: "Protein (g)",
                valueFormatter: (p: any) => `${calcNutrientPerAmntOfWght(p, p.data.calories)} g`,
            },
            {
                field: "carbs",
                headerName: "Carbs (g)",
                valueFormatter: (p: any) => `${calcNutrientPerAmntOfWght(p, p.data.calories)} g`,
            },
            {
                field: "fat",
                headerName: "Fat (g)",
                valueFormatter: (p: any) => `${calcNutrientPerAmntOfWght(p, p.data.calories)} g`,
            },
            {
                field: "sugar",
                headerName: "Sugar (g)",
                valueFormatter: (p: any) => `${calcNutrientPerAmntOfWght(p, p.data.calories)} g`,
            },
            {
                field: "amountPer",
                headerName: "Amount Per (g)",
                valueFormatter: (p: any) => p.data.name.trim().toLocaleLowerCase() !== "SubTotal".toLocaleLowerCase() ? p.value?.toLocaleString() + " g" : "-",
            },
        ],
        [calcNutrientPerAmntOfWght, FoodItemComponent]
    );


    // const getTotal = () => {
    //     setRowData([...rowData, {
    //         name: "sdf",
    //         currentWeight: rowData.reduce((acc, curr) => acc + curr.currentWeight, 0),
    //         calories: rowData.reduce((acc, curr) => acc + ((curr.calories / curr.amountPer) * curr.currentWeight), 0),
    //         protein: rowData.reduce((acc, curr) => acc + curr.protein, 0),
    //         carbs: rowData.reduce((acc, curr) => acc + curr.carbs, 0),
    //         fat: rowData.reduce((acc, curr) => acc + curr.fat, 0),
    //         sugar: rowData.reduce((acc, curr) => acc + curr.sugar, 0),
    //         amountPer: 0,
    //         category: {
    //             name: `${diet[0].category.name}`,
    //         }
    //     }]);
    //     console.log(rowData);
    // }


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
                rowData={rowData}
                columnDefs={colDefs}
                groupDefaultExpanded={1}
                rowClassRules={rowClassRules}
            />
        </div>
    )
}
