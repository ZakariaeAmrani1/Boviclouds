import { Prop } from "@nestjs/mongoose";
import { AccountStatus } from "./user.acc.status";

export class Metadata {
  @Prop({ enum: AccountStatus, default: AccountStatus.PENDING })
  statut: AccountStatus;

  @Prop({ default: '' })
  raison_sociale: string;
}
