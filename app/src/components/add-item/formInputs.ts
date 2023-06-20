import { ItemBase } from "@/shared/types";

export default interface IFormInputs<T extends ItemBase> {
  itemData?: T
  setItemData: React.Dispatch<any>
  setCanSubmit: (val: boolean) => void;
}