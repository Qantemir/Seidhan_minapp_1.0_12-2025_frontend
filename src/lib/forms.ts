// Утилиты для форм с React Hook Form + Zod
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useReactHookForm, type UseFormProps, type UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';

// Обертка над useForm с автоматической интеграцией Zod
export function useForm<T extends z.ZodType>(
  schema: T,
  options?: Omit<UseFormProps<z.infer<T>>, 'resolver'>
): UseFormReturn<z.infer<T>> {
  return useReactHookForm<z.infer<T>>({
    resolver: zodResolver(schema),
    ...options,
  });
}

// Схема для формы оформления заказа
export const checkoutFormSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  phone: z.string().min(1, 'Телефон обязателен').regex(/^[\d\s\-\+\(\)]+$/, 'Неверный формат телефона'),
  address: z.string().min(1, 'Адрес обязателен'),
  comment: z.string().optional(),
  delivery_type: z.string().optional(),
  payment_type: z.string().optional(),
  payment_receipt: z.instanceof(File, { message: 'Файл обязателен' }),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

// Схема для формы создания/редактирования товара
export const productFormSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  price: z.number().min(0, 'Цена должна быть положительной'),
  category_id: z.string().min(1, 'Категория обязательна'),
  available: z.boolean(),
  images: z.array(z.string()).optional(),
  variants: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Название варианта обязательно'),
    description: z.string().optional(),
    image: z.string().optional(),
    available: z.boolean(),
    quantity: z.number().min(0),
  })).optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

// Схема для формы создания/редактирования категории
export const categoryFormSchema = z.object({
  name: z.string().min(1, 'Название категории обязательно'),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

// Схема для формы рассылки
export const broadcastFormSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен'),
  message: z.string().min(1, 'Сообщение обязательно'),
  segment: z.enum(['all']),
  link: z.string().url('Неверный URL').optional().or(z.literal('')),
});

export type BroadcastFormData = z.infer<typeof broadcastFormSchema>;

// Схема для формы настроек магазина
export const storeSettingsFormSchema = z.object({
  sleep: z.boolean(),
  message: z.string().optional(),
});

export type StoreSettingsFormData = z.infer<typeof storeSettingsFormSchema>;

