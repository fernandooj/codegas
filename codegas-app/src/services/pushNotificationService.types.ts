
export interface NotificationResponse {
    success: boolean;
    message?: string;
    error?: string;
}


export interface PushNotificationConfig {
    token: string | null;
    initialized: boolean;
}

export interface SendTokenRequest {
    userId: string;
    fcmToken: string;
}

export interface SendTokenResponse {
    success: boolean;
    data?: any;
    error?: string;
}


export interface PushNotificationService {
    initialize: () => Promise<void>;
    getFCMToken: () => Promise<string | null>;
    sendTokenToBackend: (userId: string) => Promise<SendTokenResponse>;
    getCurrentToken: () => string | null;
    areNotificationsEnabled: () => Promise<boolean>;
    subscribeToTopic: (topic: string) => Promise<void>;
    unsubscribeFromTopic: (topic: string) => Promise<void>;
    sendTestNotification: (title?: string, message?: string) => NotificationResponse;
    sendScheduledTestNotification: (title?: string, message?: string) => NotificationResponse;
    sendTestOrderNotification: (orderId?: string, deliveryDate?: string) => NotificationResponse;
    cancelAllNotifications: () => NotificationResponse;
    showFCMTokenInfo: () => string | null;
    forceGetNewToken: () => Promise<string | null>;
    isSimulator: () => Promise<boolean>;
}
