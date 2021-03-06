import Inline from "./inline";
import ComponentType from "../const/component-type";
import { storeData } from "../decorate";
import { initRecordState } from "../record/decorators";

@initRecordState
class Character extends Inline {
  type = ComponentType.character;
  content: string;

  constructor(content: string, style?: storeData, data?: storeData) {
    super(style, data);
    this.content = content;
  }

  getRaw() {
    return {
      type: this.type,
      content: this.content
    };
  }

  render(onlyDecorate: boolean = false) {
    return this.content;
  }
}

export default Character;
