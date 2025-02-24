import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Truck } from './types/truck.type';

@Injectable()
export class TruckRepository {

  // No need to use a database for this assignment - we'll store the trucks in memory.
  private trucks: Truck[] = [
    {
      id: '1',
      registration: 'ABC123',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01'
    },
    {
      id: '2',
      registration: 'DEF456',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01'
    },
    {
      id: '3',
      registration: 'GHI789',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01'
    }
  ]

  getAll(): Truck[] {
    return this.trucks
  }

  save(data: Truck) {
    if (!data.id) {
      throw new HttpException('id was not provided', HttpStatus.BAD_REQUEST)
    }

    const now = new Date().toISOString()
    const truck = {
      ... data,
      createdAt: now,
      updatedAt: now
    }

    this.trucks.push(truck)

    return truck
  }

  update(data: Partial<Truck>) {
    if (!data.id) {
      throw new HttpException('id was not provided', HttpStatus.BAD_REQUEST)
    }

    const truck = this.trucks.find((entry) => entry.id === data.id)
    if (!truck) {
      throw new HttpException(`No entry found for id: ${data.id}`, HttpStatus.NOT_FOUND)
    }

    const now = new Date().toISOString()
    const updatedTruck = {
      ... truck,
      ... data,
      updatedAt: now
    }

    this.trucks = this.trucks.map(t => t.id === data.id ? updatedTruck : t)

    return updatedTruck
  }

  delete(id: string) {
    const initialLength = this.trucks.length
    this.trucks = this.trucks.filter((truck) => truck.id !== id)
    
    if (this.trucks.length === initialLength) {
      throw new HttpException(`No truck found with id: ${id}`, HttpStatus.NOT_FOUND)
    }
  }
}
