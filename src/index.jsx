import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import App from './App';
import { toast } from 'react-toastify';

const singleToastId = 'app-toast';
const originalToast = {
  success: toast.success.bind(toast),
  error: toast.error.bind(toast),
  info: toast.info.bind(toast),
  warn: toast.warn ? toast.warn.bind(toast) : null,
  warning: toast.warning ? toast.warning.bind(toast) : null,
};

const wrapToast = (type, originalFn) => (content, options = {}) => {
  const toastId = options.toastId ?? singleToastId;
  if (toast.isActive(toastId)) {
    toast.update(toastId, {
      ...options,
      render: content,
      type,
      toastId,
      autoClose: options.autoClose ?? 1000,
    });
    return toastId;
  }
  return originalFn(content, { ...options, toastId });
};

toast.success = wrapToast('success', originalToast.success);
toast.error = wrapToast('error', originalToast.error);
toast.info = wrapToast('info', originalToast.info);
if (originalToast.warn) {
  toast.warn = wrapToast('warning', originalToast.warn);
}
if (originalToast.warning) {
  toast.warning = wrapToast('warning', originalToast.warning);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

