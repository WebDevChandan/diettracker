"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DietType } from "@/types/Diet";
import { calNutrientFormula } from "@/utils/calNutrientFormula";
import { AllCategory } from "@prisma/client";
import { AllCommunityModule, ColDef, ModuleRegistry, RowNodeTransaction, RowSelectionOptions, themeQuartz, ValidationModule } from 'ag-grid-community';
import { AgGridReact } from "ag-grid-react";
import { Edit } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import "../styles/styles.css";
import ManageItem from "./ManageItem";
import ManageItemProvider from "../context/ManageItemProvider";

ModuleRegistry.registerModules([AllCommunityModule, ValidationModule]);

export default function DietTracker({ diet, currentCategory }: { diet: DietType, currentCategory: AllCategory }) {
    const [subTotal, setSubTotal] = useState<DietType[0]>({
        id: `${currentCategory}-subtotal-id`,
        name: "SubTotal",
        currentWeight: 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        amountPer: 0,
        category: [`${currentCategory}` as AllCategory],
        listed: false,
        listed_item_id: "subtotal-listed-id"
    });

    const gridRef = useRef<AgGridReact>(null);
    const gridStyle = useMemo(() => ({ height: "300px", width: "100%", outline: "none", border: "none" }), []);

    const defaultColDef = useMemo<ColDef>(() => {
        return {
            filter: null,
            flex: 1,
            minWidth: 100,
            enableCellChangeFlash: true,
            lockPinned: true,
            cellEditor: false,
        };
    }, []);

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
                // <EditFoodItem
                //     triggerElement={<div style={{ cursor: "pointer", fontWeight: "500", color: "#181D1F" }}>{p.value}</div>}
                //     key={itemFixedNutrientValue.id}
                //     itemToEdit={itemFixedNutrientValue}
                // />

                <Dialog>
                    <DialogTrigger asChild>
                        <div style={{ cursor: "pointer", fontWeight: "500", color: "#181D1F" }}><label className="inline-block"><Edit size={"12px"} /></label> {p.value}</div>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Item for {itemFixedNutrientValue?.category[0]}</DialogTitle>
                            <DialogDescription>Delete or Update Item as <b>Amount Per (g)</b> </DialogDescription>
                        </DialogHeader>
                        <ManageItemProvider itemToManage={itemFixedNutrientValue} >
                            <ManageItem isNewItem={false} currentCategory={[...itemFixedNutrientValue.category]} />
                        </ManageItemProvider>
                    </DialogContent>
                </Dialog>
            );
        },
        [diet, currentCategory]
    );

    const rowClassRules = useMemo(() => ({
        'bg-gray-800 text-white': (p: any) => p.data.name.trim().toLocaleLowerCase() === "SubTotal".toLocaleLowerCase()
    }), []);

    const rowSelection = useMemo<RowSelectionOptions | "single" | "multiple">(() => {
        return { mode: "multiRow" };
    }, []);

    const getRowData = useCallback(() => {
        const rowData: any[] = [];
        gridRef.current!.api.forEachNode(function (node) {
            rowData.push(node.data);
        });
        console.log("Row Data:");
        console.table(rowData);
    }, []);


    function printResult(res: RowNodeTransaction) {
        console.log("---------------------------------------");
        if (res.add) {
            res.add.forEach((rowNode) => {
                console.log("Added Row Node", rowNode);
            });
        }
        if (res.remove) {
            res.remove.forEach((rowNode) => {
                console.log("Removed Row Node", rowNode);
            });
        }
        if (res.update) {
            res.update.forEach((rowNode) => {
                console.log("Updated Row Node", rowNode);
            });
        }
    }

    const onRemoveSelected = useCallback(() => {
        const selectedData = gridRef.current!.api.getSelectedRows();
        const res = gridRef.current!.api.applyTransaction({
            remove: selectedData,
        })!;
        printResult(res);
    }, []);

    // const TotalComponent = useCallback(
    //     (p: any) => {
    //         return (
    //             p.data.name !== "Total"
    //                 ? <div style={{ cursor: "pointer" }}>{p.value}</div>
    //                 : <div style={{ cursor: "pointer" }}>totalSum</div>
    //         );
    //     },
    //     [diet]
    // );

    const [rowData, setRowData] = useState<DietType>([]);

    const newSubTotal = useMemo(() => {
        return {
            ...subTotal,
            currentWeight: diet.reduce((acc, curr) => acc + curr.currentWeight, 0),
            calories: diet.reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.calories, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
            protein: diet.reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.protein, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
            carbs: diet.reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.carbs, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
            fat: diet.reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.fat, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
            sugar: diet.reduce((acc, curr) => parseFloat((acc + calNutrientFormula(curr.sugar, curr.amountPer, curr.currentWeight)).toFixed(2)), 0),
            amountPer: 0,
            category: [`${currentCategory}` as AllCategory],
        }

    }, [diet, currentCategory]);

    useEffect(() => {
        if (diet.length === 0 && diet[0]?.category[0] === currentCategory) return;

        setRowData([...diet]);
        setSubTotal(newSubTotal);

    }, [diet, newSubTotal, currentCategory]);

    const colDefs = useMemo<ColDef[]>(
        () => [
            {
                field: "name",
                headerName: "Food Items",
                cellRenderer: FoodItemComponent,
                cellDataType: "text",
                sortable: false,
                minWidth: 150,
                filter: "agTextColumnFilter",
                lockPosition: "left",
                lockPinned: true,
            },
            {
                field: "currentWeight",
                headerName: "Food Intake Weight (g)",
                // cellRenderer: TotalComponent,
                // editable: (p: any) => p.data.name !== "Total",
                valueFormatter: (p: any) => p.value <= 2000 ? `${p.value?.toLocaleString()} g` : `${2000} g`,
            },
            {
                field: "calories",
                headerName: "Calories (Cal)",
                valueFormatter: (p: any) => `${calcNutrientPerAmntOfWght(p, p.data.calories)} Cal`,
            },
            {
                field: "protein",
                headerName: "Protein (g)",
                valueFormatter: (p: any) => `${calcNutrientPerAmntOfWght(p, p.data.protein)} g`,
            },
            {
                field: "carbs",
                headerName: "Carbs (g)",
                valueFormatter: (p: any) => `${calcNutrientPerAmntOfWght(p, p.data.carbs)} g`,
            },
            {
                field: "fat",
                headerName: "Fat (g)",
                valueFormatter: (p: any) => `${calcNutrientPerAmntOfWght(p, p.data.fat)} g`,
            },
            {
                field: "sugar",
                headerName: "Sugar (g)",
                valueFormatter: (p: any) => `${calcNutrientPerAmntOfWght(p, p.data.sugar)} g`,
            },
            {
                field: "amountPer",
                headerName: "Amount Per (g)",
                valueFormatter: (p: any) => p.data.name.trim().toLocaleLowerCase() !== "SubTotal".toLocaleLowerCase() ? p.value?.toLocaleString() + " g" : "-",
            },
        ],
        [calcNutrientPerAmntOfWght, FoodItemComponent]
    );


    return (
        <div
            id="myGrid"
            className="ag-theme-quartz"
            style={gridStyle}
        >
            {/* <Button className="mr-2" onClick={getRowData}>Get Row</Button>
            <Button className="mr-2" onClick={onRemoveSelected}>Remove Selected</Button> */}
            <AgGridReact
                defaultColDef={defaultColDef}
                columnDefs={colDefs}
                theme={themeQuartz}
                ref={gridRef}
                rowData={rowData}
                groupDefaultExpanded={1}
                rowClassRules={rowClassRules}
                // rowSelection={rowSelection}
                pinnedBottomRowData={[subTotal]}
                suppressDragLeaveHidesColumns={true}
                suppressMoveWhenColumnDragging={true}
            />
        </div>
    )
}
