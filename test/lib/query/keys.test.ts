import { createQueryKeys } from '@/lib/query/keys';

describe('createQueryKeys', () => {
  const userKeys = createQueryKeys('users');

  describe('all', () => {
    it('should return domain-level key', () => {
      expect(userKeys.all).toEqual(['users']);
    });
  });

  describe('lists()', () => {
    it('should return list-level key', () => {
      expect(userKeys.lists()).toEqual(['users', 'list']);
    });
  });

  describe('list(params)', () => {
    it('should return list key with params', () => {
      expect(userKeys.list({ page: 1, search: 'john' })).toEqual([
        'users',
        'list',
        { page: 1, search: 'john' },
      ]);
    });

    it('should return list key with undefined when no params', () => {
      expect(userKeys.list()).toEqual(['users', 'list', undefined]);
    });
  });

  describe('details()', () => {
    it('should return detail-level key', () => {
      expect(userKeys.details()).toEqual(['users', 'detail']);
    });
  });

  describe('detail(id)', () => {
    it('should return detail key with string id', () => {
      expect(userKeys.detail('abc-123')).toEqual(['users', 'detail', 'abc-123']);
    });

    it('should return detail key with numeric id', () => {
      expect(userKeys.detail(42)).toEqual(['users', 'detail', 42]);
    });
  });

  describe('different domains', () => {
    it('should produce isolated keys per domain', () => {
      const orderKeys = createQueryKeys('orders');
      const productKeys = createQueryKeys('products');

      expect(userKeys.all).toEqual(['users']);
      expect(orderKeys.all).toEqual(['orders']);
      expect(productKeys.all).toEqual(['products']);

      expect(userKeys.lists()).not.toEqual(orderKeys.lists());
    });
  });
});
