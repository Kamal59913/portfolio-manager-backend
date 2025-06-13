import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';

@Module({
  imports: [],
  controllers: [SchoolController],
  providers: [SchoolService],
  exports: [],
})
export class SchoolModule {}
