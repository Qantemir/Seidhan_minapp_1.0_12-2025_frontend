
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@/lib/router';
import { ArrowLeft, CreditCard, AlertTriangle } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { Seo } from '@/components/Seo';
import { buildCanonicalUrl } from '@/lib/seo';
import { showBackButton, hideBackButton, hideMainButton, getTelegram } from '@/lib/telegram';
import { toast } from '@/lib/toast';
import { useStoreStatus } from '@/contexts/StoreStatusContext';
import { useCart } from '@/hooks/useCart';
import { PageTransition } from '@/components/animations';
import { useFixedHeaderOffset } from '@/hooks/useFixedHeaderOffset';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: '',
  });
  const { data: cartSummary, isFetching: cartLoading } = useCart(true);
  const { status: storeStatus } = useStoreStatus();
  const { headerRef, headerHeight } = useFixedHeaderOffset(80);
  const headerTopOffset = 'calc(env(safe-area-inset-top, 0px) + var(--tg-header-height, 0px))';

  const handleSubmit = useCallback(async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.warning('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (storeStatus?.is_sleep_mode) {
      toast.warning(storeStatus.sleep_message || 'Магазин временно не принимает заказы');
      return;
    }

    if (!cartSummary || cartSummary.items.length === 0) {
      toast.warning('В корзине нет товаров');
      return;
    }

    setSubmitting(true);

    try {
      const order = await api.createOrder({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        comment: formData.comment,
      });

      toast.success('Заказ оформлен');
      navigate('/');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при оформлении заказа';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }, [formData, storeStatus?.is_sleep_mode, storeStatus?.sleep_message, cartSummary, navigate]);

  const handleBack = useCallback(() => navigate('/cart'), [navigate]);
  
  useEffect(() => {
    hideMainButton();
    showBackButton(handleBack);
    return () => {
      hideBackButton();
      hideMainButton();
    };
  }, [handleBack]);

  const isSubmitDisabled = useMemo(
    () =>
      submitting ||
      cartLoading ||
      !cartSummary ||
      cartSummary.items.length === 0 ||
      storeStatus?.is_sleep_mode,
    [submitting, cartLoading, cartSummary, storeStatus?.is_sleep_mode],
  );

  // Мемоизация JSON-LD
  const checkoutJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "CheckoutPage",
    name: "Оформление заказа",
    description: "Введите контактные данные для подтверждения заказа в Mini Shop.",
    url: buildCanonicalUrl("/checkout"),
  }), []);

  return (
    <>
      <Seo title="Оформление заказа" description="Введите контактные данные для подтверждения заказа." path="/checkout" jsonLd={checkoutJsonLd} />
      <PageTransition>
      <header 
        ref={headerRef}
        className="fixed inset-x-0 glass border-b border-border/50 px-4 py-3 sm:px-6 sm:py-4 shadow-glow relative overflow-hidden" 
        style={{
          top: headerTopOffset,
          zIndex: 10
        }}
        role="banner"
      >
        {/* Декоративный градиентный фон */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="absolute top-0 left-0 w-48 h-48 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg hover:bg-primary/20 transition-all duration-300"
            aria-label="Вернуться в корзину"
          >
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent truncate">
              Оформление заказа
            </h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <div 
        className="min-h-screen bg-background pb-32 sm:pb-24"
        style={{
          paddingTop: `calc(${headerHeight}px + env(safe-area-inset-top, 0px) + var(--tg-header-height, 0px))`
        }}
      >
      <div className="px-4 py-5 sm:px-6 sm:py-6 space-y-6">
        {/* Уведомление об оплате наличными */}
        <div className="bg-primary/10 border-2 border-primary rounded-xl p-4 sm:p-5 space-y-3 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <CreditCard className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Оплата только наличными
              </h3>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                Заказ оплачивается только наличными при получении. Подготовьте точную сумму для оплаты курьеру.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2.5">
            <Label htmlFor="name" className="text-sm font-medium">Имя *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Как к вам обращаться?"
              disabled={submitting}
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="phone" className="text-sm font-medium">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+7 (900) 123-45-67"
              disabled={submitting}
              className="h-11 text-base"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="address" className="text-sm font-medium">Адрес доставки *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
              onInput={e => setFormData(prev => ({ ...prev, address: (e.target as HTMLTextAreaElement).value }))}
              placeholder="Укажите полный адрес доставки"
              rows={3}
              disabled={submitting}
              className="text-base resize-none"
              inputMode="text"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="comment" className="text-sm font-medium">Комментарий</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={e => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              onInput={e => setFormData(prev => ({ ...prev, comment: (e.target as HTMLTextAreaElement).value }))}
              placeholder="Дополнительная информация о заказе"
              rows={2}
              disabled={submitting}
              inputMode="text"
              className="text-base resize-none"
            />
          </div>
        </div>

        <div className="text-xs sm:text-sm text-muted-foreground">
          * Обязательные поля
        </div>

        <Card className="p-4 sm:p-5 space-y-4">
          <div>
            <p className="font-semibold text-base sm:text-lg">Состав заказа</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Проверьте товары перед оплатой</p>
          </div>

          {cartLoading ? (
            <div className="space-y-2">
              {[1, 2].map(item => (
                <Skeleton key={item} className="h-16 w-full" />
              ))}
            </div>
          ) : !cartSummary || cartSummary.items.length === 0 ? (
            <p className="text-xs sm:text-sm text-muted-foreground">
              Корзина пуста. Вернитесь в каталог и добавьте товары.
            </p>
          ) : (
            <>
              <div className="space-y-3">
                {cartSummary.items.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-3 py-2 border-b border-border/50 last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base text-foreground font-medium truncate">
                        {item.product_name}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {item.variant_name && `${item.variant_name} × `}{item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground flex-shrink-0 text-sm sm:text-base whitespace-nowrap">
                      {item.quantity * item.price} ₸
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 border-t border-border/50">
                  <span className="text-sm sm:text-base text-foreground">Доставка</span>
                  <span className="font-semibold text-foreground text-sm sm:text-base whitespace-nowrap">1000 ₸</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-4 mt-2">
                <span className="font-semibold text-base sm:text-lg text-foreground">Итого</span>
                <span className="font-bold text-lg sm:text-xl text-foreground">{cartSummary.total_amount} ₸</span>
              </div>
            </>
          )}
        </Card>

        {/* Напоминание об оплате наличными перед кнопкой */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-400 dark:border-amber-600 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 dark:text-amber-500 flex-shrink-0" />
            <p className="text-sm sm:text-base font-semibold text-amber-900 dark:text-amber-100">
              💵 Оплата производится только наличными при получении заказа
            </p>
          </div>
        </div>

        <Button
          className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold shadow-lg"
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
        >
          {submitting ? 'Отправка...' : 'Подтвердить заказ'}
        </Button>
      </div>
      </div>
      </PageTransition>
    </>
  );
};
