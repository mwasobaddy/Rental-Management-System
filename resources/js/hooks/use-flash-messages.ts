import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

interface FlashMessages {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export function useFlashMessages() {
    const { props } = usePage<{ flash?: FlashMessages }>();
    
    useEffect(() => {
        if (props.flash?.success) {
            toast.success(props.flash.success);
        }
        
        if (props.flash?.error) {
            toast.error(props.flash.error);
        }
        
        if (props.flash?.warning) {
            toast.error(props.flash.warning, {
                style: {
                    background: '#f59e0b',
                    color: '#fff',
                },
            });
        }
        
        if (props.flash?.info) {
            toast(props.flash.info, {
                style: {
                    background: '#3b82f6',
                    color: '#fff',
                },
            });
        }
    }, [props.flash]);
}