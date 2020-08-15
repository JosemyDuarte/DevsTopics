export interface NotificationService {
    publish(item: unknown): Promise<void>;
}
