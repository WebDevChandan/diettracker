import useDialog from '@/app/hooks/useDialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FoodItemType } from '@/types/FoodItem';
import { AllCategory } from '@prisma/client';
import ManageItemProvider from '../context/ManageItemProvider';
import ManageItem from './ManageItem';

export default function SpeedDialFoodItem() {
    const { isAddNewItemDialog, setIsAddNewItemDialog, isListedDialog } = useDialog();

    const newItem: FoodItemType = {
        id: '',
        name: '',
        calories: 0,
        currentWeight: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        amountPer: 100,
        category: [] as AllCategory[],
        listed: false,
        listed_item_id: '',
    }

    return (
        <Dialog open={isAddNewItemDialog} onOpenChange={setIsAddNewItemDialog}>
            <DialogContent className="sm:max-w-[425px] overflow-y-auto h-5/5">
                <DialogHeader>
                    <DialogTitle>{!isListedDialog ? `Add Food Item` : "List Food Item"}</DialogTitle>
                    <DialogDescription>
                        <>
                            Add nutrients as <b>Amount Per (g)</b> from verified source
                        </>
                    </DialogDescription>
                </DialogHeader>
                <ManageItemProvider itemToManage={newItem}>
                    <ManageItem isNewItem={true} currentCategory={[]} />
                </ManageItemProvider>
            </DialogContent>
        </Dialog>
    )
}
