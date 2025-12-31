import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const DELIVERY_TIME_SLOTS = [
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
] as const;

export type DeliveryTimeSlot = typeof DELIVERY_TIME_SLOTS[number];

interface AdminDeliveryTimeDialogProps {
  open: boolean;
  updating: boolean;
  onConfirm: (timeSlot: DeliveryTimeSlot) => void;
  onOpenChange: (open: boolean) => void;
}

export const AdminDeliveryTimeDialog = ({
  open,
  updating,
  onConfirm,
  onOpenChange,
}: AdminDeliveryTimeDialogProps) => {
  const handleTimeSelect = (timeSlot: DeliveryTimeSlot) => {
    onConfirm(timeSlot);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Выберите время доставки</AlertDialogTitle>
          <AlertDialogDescription>
            Выберите временной промежуток для доставки заказа
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid grid-cols-2 gap-2 py-4">
          {DELIVERY_TIME_SLOTS.map(timeSlot => (
            <Button
              key={timeSlot}
              variant="outline"
              onClick={() => handleTimeSelect(timeSlot)}
              disabled={updating}
              className="w-full"
            >
              {timeSlot}
            </Button>
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={updating}>Отмена</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};


