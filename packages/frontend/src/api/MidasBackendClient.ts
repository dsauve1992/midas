export abstract class MidasBackendClient {
    protected static getBaseUrl(): string {
        return `${import.meta.env.VITE_BACKEND_URL}`
    }
}