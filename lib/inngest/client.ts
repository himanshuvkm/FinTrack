import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "finTrack", 
  name: "FinTrack",
  retryFunction: async (attempt : any) => ({
    delay: Math.pow(2, attempt) * 1000, // Exponential backoff
    maxAttempts: 2,
  }),
});