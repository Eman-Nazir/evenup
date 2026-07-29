import toast from 'react-hot-toast';

export const toastOptions = {
  position: 'top-right',
  duration: 3500,
  style: {
    background: '#1e293b',
    color: '#f8fafc',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 500,
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
  },
  success: {
    iconTheme: { primary: '#22c55e', secondary: '#f8fafc' },
  },
  error: {
    iconTheme: { primary: '#ef4444', secondary: '#f8fafc' },
  },
};

export const showSuccess = (message) => toast.success(message, toastOptions);
export const showError = (message) => toast.error(message, toastOptions);
export const showLoading = (message) => toast.loading(message, toastOptions);
export const dismissToast = (id) => toast.dismiss(id);

// Extracts a clean message from our standardized API error shape
export const getErrorMessage = (error) => {
  return error?.response?.data?.message || 'Something went wrong, please try again';
};