export interface NotificationService {
    publish(item: any): Promise<void>;
}
