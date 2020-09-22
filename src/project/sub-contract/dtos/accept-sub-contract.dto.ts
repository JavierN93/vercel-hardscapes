import { ApiProperty } from '@nestjs/swagger';

export class AcceptSubContractDto {
  @ApiProperty({ type: [String] })
  acceptedCustomPaymentItemIds: string[];
}
