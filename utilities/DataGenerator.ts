import { faker } from '@faker-js/faker';
import { SpartanGender, SpartanModel } from '../test-data/spartanData';

/**
 * Utility for generating dynamic, randomized Spartan test data using @faker-js/faker.
 * Ensures complete test isolation across concurrent test executions.
 */
export class DataGenerator {
  /**
   * Generates a random realistic first name matched to gender with an optional unique suffix.
   */
  public static randomName(gender?: SpartanGender, unique: boolean = true): string {
    const fakerGender = gender === 'Female' ? 'female' : gender === 'Male' ? 'male' : undefined;
    const baseName = faker.person.firstName(fakerGender);
    return unique ? `${baseName}${faker.number.int({ min: 1000, max: 9999 })}` : baseName;
  }

  /**
   * Generates a valid 10-to-13 digit numeric phone string conforming to the Spartan regex ^\d{10,13}$.
   */
  public static randomPhoneNumber(length: number = 10): string {
    const validLength = Math.max(10, Math.min(13, length));
    return faker.string.numeric({ length: validLength, allowLeadingZeros: false });
  }

  /**
   * Picks a random Spartan gender ('Male' or 'Female').
   */
  public static randomGender(): SpartanGender {
    return faker.helpers.arrayElement<SpartanGender>(['Male', 'Female']);
  }

  /**
   * Generates a complete valid SpartanModel using Faker data.
   */
  public static generateSpartan(gender?: SpartanGender): SpartanModel {
    const selectedGender = gender ?? this.randomGender();
    return {
      name: this.randomName(selectedGender),
      gender: selectedGender,
      phone: this.randomPhoneNumber(10),
    };
  }

  /**
   * Generates invalid test data for negative validation scenarios.
   */
  public static invalidPhoneShort(): string {
    return faker.string.numeric(5);
  }

  public static invalidPhoneAlpha(): string {
    return faker.string.alpha(10);
  }
}
