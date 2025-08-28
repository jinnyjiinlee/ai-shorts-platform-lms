 export class ErrorService {
    static handleError(error: any, message: string): never {
      console.error(`[${message}]:`, error);

      // Supabase 에러인 경우 상세 정보 포함
      if (error?.code) {
        throw new Error(`${message} (${error.code})`);
      }

      throw new Error(message);
    }

    static logError(context: string, error: any) {
      console.error(`[${context}]:`, error);
    }
  }