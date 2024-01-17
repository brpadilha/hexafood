export const IQueueService = 'IQueueService';

export interface IQueueService {
    sendMessage(ueueName: string, message: string);
    getQueueUrl(queueName: string): Promise<any>;
}
