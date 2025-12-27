export function handleAxiosErrors(name){
    return (err) => {
    console.error(`\n===== [Axios Error] ${name} failed =====`);

    // Basic message
    console.error("Message:", err.message);

    // Error code (ECONNABORTED, ENOTFOUND, ECONNREFUSED, etc)
    if (err.code) console.error("Code:", err.code);

    // Request config (very useful)
    if (err.config) {
      console.error("Request URL:", err.config.url);
      console.error("Method:", err.config.method);
      console.error("Timeout:", err.config.timeout);
    }

    // When server RESPONDED with an error (4xx, 5xx)
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Response Data:", err.response.data);
    }
    // When NO response (timeout, DNS failure, connection refused)
    else if (err.request) {
      console.error("No response received:", err.request);
    }

    // Stack trace (your missing piece)
    if (err.stack) {
      console.error("\nStack trace:");
      console.error(err.stack);
    }

    console.error("======================================\n");
  };
}