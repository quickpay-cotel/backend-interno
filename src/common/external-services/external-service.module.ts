import { Module } from '@nestjs/common';
import { IsipassGraphqlService } from './isipass.graphql.service';

@Module({
  providers: [IsipassGraphqlService],
  exports: [IsipassGraphqlService],
})
export class ExternalServiceModule {}
