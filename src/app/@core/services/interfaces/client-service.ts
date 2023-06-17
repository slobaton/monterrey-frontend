export interface IClientService {
  deleteClient(id: string): Promise<void>;
}
