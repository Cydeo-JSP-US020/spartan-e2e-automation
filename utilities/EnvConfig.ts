import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Type-safe configuration loader for test environment variables.
 */
export class EnvConfig {
  public static readonly BASE_URL: string =
    process.env.BASE_URL || 'https://spartan-app-new-nonsecure.onrender.com';

  public static readonly HEADLESS: boolean = process.env.HEADLESS !== 'false';

  public static readonly SLOWMO: number = Number(process.env.SLOWMO) || 0;

  public static readonly TIMEOUT: number = Number(process.env.TIMEOUT) || 30000;
}
