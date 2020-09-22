import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SetupPaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty()
  @IsNotEmpty()
  bankAccountName: string;

  @ApiProperty()
  @IsNotEmpty()
  bankAccountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  bankRoutingNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  bankAccountAddress: string;
}
