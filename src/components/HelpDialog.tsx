import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { X } from "@/components/icons";
import { useLanguage } from '@/contexts/LanguageContext';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Modal = ({
  open,
  onClose,
  children,
  labelledBy,
  describedBy,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy: string;
  describedBy?: string;
}) => {
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onClick={handleBackdrop}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl bg-background shadow-2xl border border-border">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label={t.common.close}
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export const HelpDialog = ({ open, onOpenChange }: HelpDialogProps) => {
  const { t } = useLanguage();
  const handleClose = () => onOpenChange(false);

  const titleId = "help-dialog-title";
  const descId = "help-dialog-description";

  return (
    <Modal open={open} onClose={handleClose} labelledBy={titleId} describedBy={descId}>
      <div className="flex flex-col h-full max-h-[90vh]">
        <div className="px-5 py-4 border-b">
          <h2 id={titleId} className="text-lg sm:text-xl font-semibold text-foreground">
            {t.help.title}
          </h2>
          <p id={descId} className="text-sm text-muted-foreground mt-1">
            {t.help.description}
          </p>
        </div>

        <div className="space-y-4 overflow-y-auto flex-1 px-5 py-4 pr-4" style={{ scrollbarWidth: "thin" }}>
          <section>
            <h3 className="text-sm font-semibold text-foreground">{t.help.howToOrder.title}</h3>
            <ol className="mt-2 text-sm text-muted-foreground space-y-2 list-decimal pl-5">
              {t.help.howToOrder.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            <p className="mt-2 text-sm text-muted-foreground">
              {t.help.howToOrder.afterOrder}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground">{t.help.cart.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t.help.cart.description}
            </p>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1 list-disc pl-4">
              {t.help.cart.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground">{t.help.payment.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t.help.payment.description}
            </p>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1 list-disc pl-4">
              <li>
                <strong>{t.help.payment.formats}</strong> {t.help.payment.formatsList}
              </li>
              <li>
                <strong>{t.help.payment.howToAttach}</strong> {t.help.payment.howToAttachText}
              </li>
              <li>
                <strong>{t.help.payment.ifNotUploading}</strong> {t.help.payment.ifNotUploadingText}
              </li>
              <li>
                <strong>{t.help.payment.important}</strong> {t.help.payment.importantText}
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground">{t.help.delivery.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t.help.delivery.description}
            </p>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1 list-disc pl-4">
              {t.help.delivery.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-muted-foreground">
              {t.help.delivery.totalNote}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground">{t.help.orderStatus.title}</h3>
            <div className="mt-2 space-y-3">
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">{t.help.orderStatus.accepted.title}</p>
                <p className="text-muted-foreground">
                  {t.help.orderStatus.accepted.description}
                </p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">{t.help.orderStatus.rejected.title}</p>
                <p className="text-muted-foreground">
                  {t.help.orderStatus.rejected.description}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {t.help.orderStatus.notifications}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground">{t.help.troubleshooting.title}</h3>
            <ul className="mt-2 text-sm text-muted-foreground space-y-2 list-disc pl-4">
              {t.help.troubleshooting.items.map((item, index) => (
                <li key={index}>
                  <strong>{item.title}</strong> {item.text}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground">{t.help.appClosed.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t.help.appClosed.description}
            </p>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1 list-disc pl-4">
              {t.help.appClosed.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-foreground">{t.help.needHelp.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t.help.needHelp.description}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t.help.needHelp.helpText}
            </p>
          </section>
        </div>

        <div className="flex justify-end px-5 py-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            {t.common.close}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
