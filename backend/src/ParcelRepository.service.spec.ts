import { Test, TestingModule } from '@nestjs/testing';
import { ParcelRepository } from './ParcelRepository.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Parcel } from './types/parcel.type';

describe('ParcelRepository', () => {
  let repository: ParcelRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParcelRepository],
    }).compile();

    repository = module.get<ParcelRepository>(ParcelRepository);
  });

  describe('getAll', () => {
    it('should return empty array by default', () => {
      const parcels = repository.getAll();
      expect(parcels).toEqual([
        {
          id: 'a',
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
          weight: 8.0,
          truckId: null,
          destination: 'London'
        },
        {
          id: 'b',
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
          weight: 10.2,
          truckId: null,
          destination: 'Manchester'
        },
        {
          id: 'c',
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
          weight: 16.7,
          truckId: null,
          destination: 'Birmingham'
        }
      ]);
    });
  });

  describe('save', () => {
    it('should save a new parcel', () => {
      const newParcel: Parcel = { id: '1', truckId: '1', destination: 'Destination 1', weight: 10, createdAt: '2025-01-01', updatedAt: '2025-01-01' };
      const savedParcel = repository.save(newParcel);
      
      expect(savedParcel.id).toBeDefined();
      expect(savedParcel.weight).toBe(10);
      expect(savedParcel.createdAt).toBeDefined();
      
      const allParcels = repository.getAll();
      expect(allParcels).toHaveLength(4);
    });

    it('should throw error if weight is not positive', () => {
      expect(() => repository.save({ weight: 0 } as any))
        .toThrow(new HttpException('Weight must be greater than 0', HttpStatus.BAD_REQUEST));
    });
  });

  describe('update', () => {
    it('should update an existing parcel', () => {
      const parcel: Parcel = { id: '1', truckId: '1', destination: 'Destination 1', weight: 10, createdAt: '2025-01-01', updatedAt: '2025-01-01' };
      repository.save(parcel);
      
      const updateData = { id: parcel.id, weight: 20 };
      const updatedParcel = repository.update(updateData);
      
      expect(updatedParcel.id).toBe(parcel.id);
      expect(updatedParcel.weight).toBe(20);
      expect(updatedParcel.updatedAt).toBeDefined();
    });

    it('should throw error if id not provided', () => {
      expect(() => repository.update({ weight: 10 }))
        .toThrow(new HttpException('id was not provided', HttpStatus.BAD_REQUEST));
    });

    it('should throw error if parcel not found', () => {
      expect(() => repository.update({ id: 'nonexistent', weight: 10 }))
        .toThrow(HttpException);
    });
  });

  describe('delete', () => {
    it('should delete an existing parcel', () => {
      const parcel: Parcel = { id: '1', truckId: '1', destination: 'Destination 1', weight: 10, createdAt: '2025-01-01', updatedAt: '2025-01-01' };
      repository.save(parcel);
      expect(repository.getAll()).toHaveLength(4);

      repository.delete(parcel.id);
      const parcels = repository.getAll();
      expect(parcels).toHaveLength(3);
    });

    it('should throw error if parcel not found', () => {
      expect(() => repository.delete('nonexistent'))
        .toThrow(HttpException);
    });
  });

  describe('getById', () => {
    it('should return a parcel by id', () => {
      const parcel: Parcel = { id: '1', truckId: '1', destination: 'Destination 1', weight: 10, createdAt: '2025-01-01', updatedAt: '2025-01-01' };
      repository.save(parcel);
      const found = repository.getById(parcel.id);
      expect(found).toEqual(parcel);
    });

    it('should throw error if parcel not found', () => {
      expect(() => repository.getById('nonexistent'))
        .toThrow(HttpException);
    });
  });
}); 