import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://postgres:c5IgIqAZHLUSmltS@db.bnnzuxutjxqsgcvicitw.supabase.co:5432/postgres',
        },
      },
    });
  }
}
