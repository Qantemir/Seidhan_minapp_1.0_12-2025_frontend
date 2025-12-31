import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HoverScale } from '@/components/animations';
import { getProductImageUrl } from '@/lib/api';
import type { Product } from '@/types/api';

interface ProductCardProps {
  product: Product;
  onAddToCart: (
    productId: string,
    variantId: string | undefined,
    quantity: number
  ) => void;
  purchasesDisabled?: boolean;
  isAdding?: boolean;
}

export const ProductCard = ({
  product,
  onAddToCart,
  purchasesDisabled = false,
  isAdding = false,
}: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  // Храним только id, чтобы выбранная вариация автоматически обновлялась
  // при приходе свежих данных каталога (кол-во, доступность).
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants?.[0]?.id ?? null
  );
  const [imageError, setImageError] = useState(false);

  const hasVariants = product?.variants && Array.isArray(product.variants) && product.variants.length > 0;
  const selectedVariant = hasVariants
    ? product.variants?.find(v => v?.id === selectedVariantId) ?? product.variants?.[0] ?? null
    : null;
  const mustSelectVariant = !selectedVariant;
  // Используем только images массив (первый элемент - основное изображение)
  const imageSource = product?.images?.[0];
  const displayImage = imageSource && !imageError ? getProductImageUrl(imageSource) : null;
  
  // Товар без вариаций не может быть продан
  if (!hasVariants) {
    return (
      <Card className="w-full overflow-hidden border-border bg-card rounded-2xl shadow-sm h-full opacity-60">
        {displayImage && (
          <div className="aspect-[4/3] w-full overflow-hidden bg-muted" role="img" aria-label={`Изображение товара ${product.name}`}>
            <img
              src={displayImage}
              alt={product?.description ? `${product?.name || 'Товар'} - ${product.description.substring(0, 100)}` : product?.name || 'Товар'}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        )}
        <div className="p-3 space-y-3">
          <header>
            <h3 className="font-semibold text-foreground">{product?.name || 'Без названия'}</h3>
            {product?.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {product.description}
              </p>
            )}
          </header>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Товар недоступен</p>
            <p className="text-xs text-muted-foreground mt-1">Нет доступных вариаций</p>
          </div>
        </div>
      </Card>
    );
  }
  
  const currentPrice = product?.price ?? 0; // Используем цену товара
  const rawQuantity = selectedVariant?.quantity;
  const availableQuantity =
    typeof rawQuantity === 'number' && rawQuantity > 0 ? rawQuantity : Number.POSITIVE_INFINITY;
  // Доступность берём из флага available; количество не блокирует, если не задано
  const isAvailable = (selectedVariant?.available ?? product?.available ?? false);

  const handleAddToCart = () => {
    if (mustSelectVariant) {
      return;
    }
    if (hasVariants && availableQuantity < quantity) {
      return;
    }
    if (isAvailable && !purchasesDisabled) {
      onAddToCart(product.id, selectedVariant?.id, quantity);
      setQuantity(1);
    }
  };

  const increment = () => {
    if (selectedVariant) {
      if (Number.isFinite(availableQuantity)) {
        if (availableQuantity > quantity) {
          setQuantity(prev => Math.min(prev + 1, availableQuantity));
        }
      } else {
        setQuantity(prev => prev + 1);
      }
    } else {
      setQuantity(prev => prev + 1);
    }
  };
  
  const decrement = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <HoverScale>
      <Card className="w-full overflow-hidden border-border/50 bg-gradient-to-br from-card via-card/95 to-card/90 rounded-2xl shadow-card h-full transition-all duration-300 hover:shadow-glow hover:border-primary/30 relative group">
        {/* Декоративный градиентный акцент */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
        
        {displayImage && (
          <motion.div 
            className="aspect-[3/2] w-full overflow-hidden bg-muted relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            role="img"
            aria-label={`Изображение товара ${product.name}`}
          >
            {/* Градиентный оверлей на изображении */}
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent z-10 pointer-events-none" />
            <img
              src={displayImage}
              alt={product?.description ? `${product?.name || 'Товар'} - ${product.description.substring(0, 100)}` : product?.name || 'Товар'}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          </motion.div>
        )}
      
      <article className="p-3 sm:p-4 space-y-3">
        <header>
          <h3 className="font-semibold text-sm sm:text-base text-foreground leading-tight line-clamp-1">{product?.name || 'Без названия'}</h3>
          {product?.description && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </header>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Вкус *:</p>
            <div className="flex flex-wrap gap-2">
              {product?.variants?.map((variant) => {
                if (!variant || !variant.id) return null;
                const variantQuantity = variant.quantity ?? 0;
                const isOutOfStock = variantQuantity === 0;
                return (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariantId(variant.id);
                      setQuantity(1);
                    }}
                    disabled={!variant.available || isOutOfStock}
                    className={`px-3 py-2 text-xs sm:text-sm rounded-lg border transition-all min-h-[36px] flex items-center justify-center relative overflow-hidden ${
                      selectedVariant?.id === variant.id
                        ? 'gradient-primary text-primary-foreground border-primary/50 shadow-sm glow-primary'
                        : 'bg-secondary/60 text-secondary-foreground border-border/50 hover:bg-secondary/80 hover:border-primary/30 active:scale-95 hover:shadow-md'
                    } ${!variant.available || isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="font-medium">{variant.name || 'Без названия'}</span>
                    {variantQuantity > 0 && (
                      <span className="ml-1.5 text-xs opacity-75">
                        ({variantQuantity})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {mustSelectVariant && (
              <p className="text-xs text-destructive mt-1">Выберите вкус</p>
            )}
          </div>

        <div className="flex items-center justify-between pt-1 gap-2.5">
          <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {currentPrice} ₸
          </div>

          {isAvailable && !purchasesDisabled && selectedVariant ? (
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-0.5 bg-secondary rounded-lg px-1.5 py-1 border border-border/50">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={decrement}
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-md"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                <span className="w-7 sm:w-8 text-center font-semibold text-xs sm:text-sm">{quantity}</span>
                <Button
                  size="icon"
                  variant="ghost"
                onClick={increment}
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-md"
          disabled={hasVariants && Number.isFinite(availableQuantity) && quantity >= availableQuantity}
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
              
              <Button 
                onClick={handleAddToCart} 
                size="sm" 
                className="px-3 sm:px-4 text-xs sm:text-sm font-medium h-9 sm:h-10 shadow-sm min-w-[90px] sm:min-w-[100px] gradient-primary hover:opacity-90 glow-hover transition-all duration-300 relative overflow-hidden group"
                disabled={isAdding}
              >
                <span className="relative z-10">{isAdding ? 'Добавление...' : 'В корзину'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
            </div>
          ) : mustSelectVariant ? (
            <span className="text-sm text-destructive font-medium">
              Выберите вкус
            </span>
          ) : isAvailable && purchasesDisabled ? (
            <span className="text-sm text-muted-foreground text-right">
              Магазин временно не принимает заказы
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">Нет в наличии</span>
          )}
        </div>
      </article>
    </Card>
    </HoverScale>
  );
};

// Оптимизированная мемоизация компонента
export const MemoizedProductCard = memo(ProductCard, (prevProps, nextProps) => {
  // Быстрая проверка по ID
  if (prevProps.product.id !== nextProps.product.id) return false;
  // Проверка критичных пропсов
  return (
    prevProps.product.available === nextProps.product.available &&
    prevProps.purchasesDisabled === nextProps.purchasesDisabled &&
    prevProps.isAdding === nextProps.isAdding &&
    prevProps.product.price === nextProps.product.price
  );
});
