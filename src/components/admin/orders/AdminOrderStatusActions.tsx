import type { OrderStatus } from '@/types/api';
import { Button } from '@/components/ui/button';
import { AdminSectionCard } from '@/components/admin/AdminSectionCard';

interface AdminOrderStatusActionsProps {
  availableStatuses: OrderStatus[];
  currentStatus: OrderStatus;
  labels: Record<OrderStatus, string>;
  onSelect: (status: OrderStatus) => void;
  disabled?: boolean;
  deliveryTimeSlot?: string;
}

export const AdminOrderStatusActions = ({
  availableStatuses,
  currentStatus,
  labels,
  onSelect,
  disabled = false,
  deliveryTimeSlot,
}: AdminOrderStatusActionsProps) => (
  <AdminSectionCard title="Изменить статус" ariaLabel="Изменить статус заказа">
    <div className="grid grid-cols-2 gap-2">
      {availableStatuses.map(status => {
        const isAccepted = status === 'принят';
        const isCurrentAccepted = currentStatus === 'принят';
        const showTimeSlot = isAccepted && isCurrentAccepted && deliveryTimeSlot;
        // Разрешаем нажатие на "принят" даже если заказ уже принят (для изменения времени доставки)
        const isDisabled = disabled || (currentStatus === status && !isAccepted);
        
        return (
          <Button
            key={status}
            variant={currentStatus === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(status)}
            disabled={isDisabled}
            className="w-full flex flex-col items-center justify-center gap-1"
            aria-pressed={currentStatus === status}
          >
            <span>{labels[status]}</span>
            {showTimeSlot && (
              <span className="text-xs opacity-90 font-normal">
                {deliveryTimeSlot}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  </AdminSectionCard>
);

