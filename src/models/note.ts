import { computed } from "mobx";
import { Model, idProp, model, prop } from "mobx-keystone";

@model("Note")
export class Note extends Model({
  id: idProp,
  subject: prop<string>(),
  document: prop<string>(),
  createdAt: prop<number>(() => Date.now()),
  isDeleted: prop<boolean>(() => false),
}) {
  @computed
  get line() {
    const words = this.document.split(" ");
    return words.slice(0, 3).join(" ");
  }
}
