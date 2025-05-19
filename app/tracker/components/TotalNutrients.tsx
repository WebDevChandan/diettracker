import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useDialog from '@/app/hooks/useDialog';
import { useDiet } from '../hook/useDiet';

export default function TotalNutrients() {
    const { total } = useDiet();
    const { isTotalDialog, setIsTotalDialog } = useDialog();
    
    return (
        <Dialog open={isTotalDialog} onOpenChange={setIsTotalDialog}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Total Nutrients</DialogTitle>
                    <DialogDescription>
                        Calculated total nutrients from all food items
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-2">
                    <div className="w-full">
                        <p className="font-semibold text-left">Calories</p>
                        <p className='col-span-3'>{total.calories} Cal</p>
                    </div>
                    <div className="w-full">
                        <p className="font-semibold text-left">Protein</p>
                        <p className='col-span-3'>{total.protein} g</p>
                    </div>
                    <div className="w-full">
                        <p className="font-semibold text-left">Carbs</p>
                        <p className='col-span-3'>{total.carbs} g</p>
                    </div>
                    <div className="w-full">
                        <p className="font-semibold text-left">Fat</p>
                        <p className='col-span-3'>{total.fat} g</p>
                    </div>
                    <div className="w-full">
                        <p className="font-semibold text-left">Sugar</p>
                        <p className='col-span-3'>{total.sugar} g</p>
                    </div>
                    <div className="w-full">
                        <p className="font-semibold text-left">Food Intake</p>
                        <p className='col-span-3'>{total.currentWeight} g</p>
                    </div>
                </div >
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button">Done</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
