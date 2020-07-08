import { getComponentFactory } from ".";
import { operatorType, IRawType } from "./component";
import Block from "./block";
import ComponentType from "../const/component-type";
import StructureType from "../const/structure-type";
import { storeData } from "../decorate/index";
import { getContentBuilder } from "../content";
import { initRecordState } from "../record/decorators";

export type mediaType = "image" | "audio" | "video";

@initRecordState
class Media extends Block {
  src: string;
  mediaType: mediaType;
  type = ComponentType.media;
  structureType = StructureType.content;

  static create(raw: IRawType): Media {
    return getComponentFactory().buildMedia(
      raw.mediaType as mediaType,
      raw.src || "",
      raw.style,
      raw.data
    );
  }

  constructor(
    mediaType: mediaType,
    src: string,
    style?: storeData,
    data?: storeData
  ) {
    super(style, data);
    this.mediaType = mediaType;
    this.src = src;
    this.decorate.mergeStyle({
      margin: "auto"
    });
  }

  setSrc(src: string) {
    this.src = src;
  }

  getSize(): number {
    return 1;
  }

  removeSelf(customerUpdate: boolean = false): operatorType {
    let paragraph = getComponentFactory().buildParagraph();
    this.replaceSelf(paragraph, customerUpdate);
    return [paragraph, 0, 0];
  }

  receive(block?: Block, customerUpdate: boolean = false): operatorType {
    if (!block) return;
    if (block.isEmpty()) {
      block.removeSelf(customerUpdate);
      return [this, 1, 1];
    }
    super.removeSelf(customerUpdate);
    return [block, 0, 0];
  }

  split(
    index: number,
    block?: Block,
    customerUpdate: boolean = false
  ): operatorType {
    let parent = this.getParent();
    if (!block) {
      block = getComponentFactory().buildParagraph();
    }
    let componentIndex = parent.findChildrenIndex(this);
    if (index === 0) {
      parent.addChildren([block], componentIndex, customerUpdate);
    }
    if (index === 1) {
      parent.addChildren([block], componentIndex + 1, customerUpdate);
    }
    return [block, index, index];
  }

  remove(
    start?: number,
    end?: number,
    customerUpdate: boolean = false
  ): operatorType {
    return this.replaceSelf(
      getComponentFactory().buildParagraph(),
      customerUpdate
    );
  }

  modifyContentDecorate(
    start: number,
    end: number,
    style?: storeData,
    data?: storeData,
    customerUpdate: boolean = false
  ) {
    this.modifyDecorate(style, data, customerUpdate);
    return [this, 0, 1];
  }

  getType(): string {
    return `${this.type}>${this.mediaType}`;
  }

  getStatistic() {
    let res = super.getStatistic();
    res[this.mediaType] += 1;
    return res;
  }

  getRaw(): IRawType {
    let raw = super.getRaw();
    raw.src = this.src;
    raw.mediaType = this.mediaType;
    return raw;
  }

  render() {
    let builder = getContentBuilder();
    let map = {
      image: "buildeImage",
      audio: "buildeAudio",
      video: "buildeVideo"
    };

    return builder[map[this.mediaType]](
      this.id,
      this.src,
      this.decorate.getStyle(),
      this.decorate.getData()
    );
  }
}

export default Media;
