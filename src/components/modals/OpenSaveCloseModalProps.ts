import { EventInput } from "@fullcalendar/core";

export interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (eventData: EventInput) => void;
}

export interface DateRangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (start: Date, end: Date) => void;
}

export interface DeviceCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    deviceCodeMessage: any;
}

export interface GenerateRecommendationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (eventData: EventInput) => void;
}

export interface RedirectLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    link: string;
}