import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document<Schema.Types.ObjectId> {
  name: string;
  email: string;
  password: string;
}
export interface Ivault extends Document {
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  ownerid: IUser["_id"];
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

const vaultSchema: Schema<Ivault> = new Schema({
  title: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  url: { type: String, required: true },
  notes: { type: String, required: true },
  ownerid: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export const Vault: Model<Ivault> =
  mongoose.models.Vault || mongoose.model<Ivault>("Vault", vaultSchema);


