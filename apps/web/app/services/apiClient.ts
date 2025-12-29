const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const apiClient = {
    get: async <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
        const url = new URL(`${API_URL}${endpoint}`);
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                    url.searchParams.append(key, String(params[key]));
                }
            });
        }

        const res = await fetch(url.toString(), {
            headers: {
                'Content-Type': 'application/json',
                // Add Authorization header here later
            },
            cache: 'no-store' // Ensure fresh data
        });

        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }

        return res.json();
    }
};
