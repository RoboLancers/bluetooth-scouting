import { Prisma } from "@prisma/client";
export type BluetoothRequest = {
  method: "CREATE" | "UPDATE";
  data: {
    type: "SCOUT" | "SCHEMA";
    id?: number;
    raw:
      | Prisma.SchemaCreateInput
      | Prisma.SchemaUpdateInput
      | Prisma.ScoutsCreateInput
      | Prisma.ScoutsUpdateInput;
  };
};
