// export const API_CONFIG = {
//   CETUS: {
//     BASE_URL: 'https://api-sui.cetus.zone',
//     ENDPOINTS: {
//       ALL_TOKENS: '/v2/allTokens',
//       COINS_INFO: '/v2/sui/coins_info',
//     }
//   },
//   SUILEND: {
//     BASE_URL: import.meta.env.VITE_SUILEND_URL,
//     ENDPOINTS: {
//       PRICE: '/price',
//       PROXY_PRICE: '/proxy/price'
//     }
//   },
//   SUICETUS: {
//     BASE_URL: import.meta.env.VITE_SUICETUS_URL,
//     ENDPOINTS: {
//       // Thêm các endpoints của SUICETUS
//     }
//   },
//   TUSKY: {
//     BASE_URL: import.meta.env.VITE_TUSKY_URL,
//     ENDPOINTS: {
//       // Thêm các endpoints của TUSKY
//     }
//   }
// } as const;

// // Helper function để build URL
// export const buildApiUrl = (service: keyof typeof API_CONFIG, endpoint: string, preserveOriginalUrl = false) => {
//   // Nếu là URL đầy đủ và cần giữ nguyên
//   if (preserveOriginalUrl && endpoint.startsWith('http')) {
//     return endpoint;
//   }

//   const baseUrl = API_CONFIG[service].BASE_URL;
//   // Xử lý endpoint có thể bắt đầu bằng / hoặc không
//   const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
//   return `${baseUrl}${cleanEndpoint}`;
// }; 