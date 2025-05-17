import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { BellAlertIcon, ExclamationCircleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// Toast types with their respective styles and icons
const toastTypes = {
  success: {
    icon: CheckCircleIcon,
    className: 'bg-gradient-to-r from-green-500 to-emerald-500',
    iconClass: 'text-white'
  },
  error: {
    icon: ExclamationCircleIcon,
    className: 'bg-gradient-to-r from-red-500 to-pink-500',
    iconClass: 'text-white'
  },
  info: {
    icon: InformationCircleIcon,
    className: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    iconClass: 'text-white'
  },
  warning: {
    icon: BellAlertIcon,
    className: 'bg-gradient-to-r from-amber-500 to-orange-500',
    iconClass: 'text-white'
  },
  activity: {
    icon: BellAlertIcon,
    className: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    iconClass: 'text-white'
  }
};

// Custom toast component
const CustomToast = ({ title, message, type = 'info', icon: CustomIcon }) => {
  const { icon: DefaultIcon, className, iconClass } = toastTypes[type] || toastTypes.info;
  const Icon = CustomIcon || DefaultIcon;

  return (
    <div className="flex items-start">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${className} flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${iconClass}`} />
      </div>
      <div className="ml-3 flex-1">
        {title && <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>}
        <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
};

// Toast notification functions
export const showToast = (title, message, type = 'info', icon = null) => {
  return toast(<CustomToast title={title} message={message} type={type} icon={icon} />, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showConfirmToast = (title, message, onConfirm, onCancel) => {
  return toast(
    <div>
      <CustomToast title={title} message={message} type="warning" />
      <div className="mt-2 flex justify-end space-x-2">
        <button 
          onClick={() => {
            toast.dismiss();
            if (onCancel) onCancel();
          }}
          className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            toast.dismiss();
            if (onConfirm) onConfirm();
          }}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>,
    {
      position: "bottom-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
    }
  );
};

// Activity reminder notification
export const showActivityReminder = (tripName, activityTitle, activityTime) => {
  // Show browser notification if supported
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(tripName, {
        body: `${activityTitle} is coming up at ${activityTime}`,
        icon: '/favicon.ico',
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(tripName, {
            body: `${activityTitle} is coming up at ${activityTime}`,
            icon: '/favicon.ico',
          });
        }
      });
    }
  }
  
  // Also show in-app toast
  return showToast(
    tripName,
    `${activityTitle} is coming up at ${activityTime}`,
    'activity'
  );
};

// Hook to request notification permissions
export const useNotificationPermission = () => {
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);
};

export default CustomToast; 