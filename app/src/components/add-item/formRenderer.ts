import { ItemBase } from "@/shared/types";

export default interface IFormRenderer<T extends ItemBase> {
  itemData?: T
  updateData: (attr: string, value: any) => void
  setCanSubmit: (val: boolean) => void;
}