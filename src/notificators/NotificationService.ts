export interface NotificationService {
    publish(item: never): Promise<void>;
}
