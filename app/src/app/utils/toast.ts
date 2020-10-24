import { ToastOptions } from '@ionic/core/dist/types/components/toast/toast-interface';

export function newFailedToast(message: string): ToastOptions {
  return {
    message: message,
    position: 'middle',
    color: 'tertiary',
  };
}
