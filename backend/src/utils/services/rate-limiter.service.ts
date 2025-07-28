// rate-limiter.service.ts
import { Injectable } from '@nestjs/common';

interface RateLimitEntry {
  lastRequestTime: number;
  count: number;
}

@Injectable()
export class RateLimiterService {
  private readonly ipEmailMap: Map<string, RateLimitEntry> = new Map();

  private readonly TIME_WINDOW = 60 * 1000; 
  private readonly MAX_REQUESTS = 3;

  async canResendEmail(ip: string, email: string): Promise<boolean> {
    const key = `${ip}_${email}`;
    const currentTime = Date.now();
    const entry = this.ipEmailMap.get(key);

    if (entry) {
      // Within the time window
      if (currentTime - entry.lastRequestTime < this.TIME_WINDOW) {
        if (entry.count >= this.MAX_REQUESTS) {
          return false;
        }
        entry.count++;
      } else {
        // Reset counter after window
        entry.count = 1;
        entry.lastRequestTime = currentTime;
      }
      this.ipEmailMap.set(key, entry);
    } else {
      this.ipEmailMap.set(key, {
        lastRequestTime: currentTime,
        count: 1,
      });
    }

    return true;
  }
}
