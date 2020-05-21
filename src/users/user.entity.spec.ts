import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('Test user.entity', () => {
  let user: User;
  const TEST_SALT = 'saltea#r3r3r';
  const TEST_PASSWORD = 'admin12FeR4';
  const WRONG_PASSWORD = '1234';
  beforeEach(() => {
    user = new User();
    user.password = TEST_PASSWORD;
    user.salt = TEST_SALT;
    bcrypt.hash = jest.fn();
  });

  describe('checkPassword', () => {
    it('returns true as password is valid', async () => {
      bcrypt.hash.mockReturnValue(TEST_PASSWORD);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.checkPassword(TEST_PASSWORD);
      expect(bcrypt.hash).toHaveBeenCalledWith(TEST_PASSWORD, TEST_SALT);
      expect(result).toEqual(true);
    });

    it('returns false as password is invalid', async () => {
      bcrypt.hash.mockReturnValue(WRONG_PASSWORD);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.checkPassword(WRONG_PASSWORD);
      expect(bcrypt.hash).toHaveBeenCalledWith(WRONG_PASSWORD, TEST_SALT);
      expect(result).toEqual(false);
    });
  });
});
