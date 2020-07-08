import Component, {
  classType,
  operatorType,
  IRawType,
  ISnapshoot
} from "./component";
import StructureCollection from "./structure-collection";
import { saveBlock, createError } from "./util";
import { storeData } from "../decorate/index";
import { recordMethod } from "../record/decorators";

export interface IBlockSnapshoot extends ISnapshoot {
  active: boolean;
}

abstract class Block extends Component {
  // 否是有效的
  active: boolean = false;
  parent?: StructureCollection<Block>;

  // 根据 raw 保存的内容恢复组件
  static create(raw: IRawType): Component {
    throw createError("组件未实现 create 静态方法", this);
  }

  // 定义如何将别的组件转换为当前组件，不会触发更新
  static exchangeOnly(component: Component, args?: any[]): Component[] {
    throw createError("组件未实现 exchangeOnly 静态方法", this);
  }

  // 将别的组件转换为当前组件，并更新组件在文档中的状态
  static exchange(
    component: Component,
    args?: any[],
    customerUpdate: boolean = false
  ): Component[] {
    throw createError("组件未实现 exchange 静态方法", this);
  }

  constructor(style?: storeData, data?: storeData) {
    super(style, data);
    saveBlock(this);
  }

  // 获取类型
  getType(): string {
    return this.type;
  }

  // 获取父节点
  getParent() {
    let parent = this.parent;
    if (!parent) throw createError("该节点已失效", this);
    return parent;
  }

  // 判断该组件是否为空，为空并不代表无效
  isEmpty(): boolean {
    return false;
  }

  // 获取子组件的长度
  getSize(): number {
    return 0;
  }

  // 创建一个空的当前组件
  createEmpty(): Component {
    throw createError("组件未实现 createEmpty 方法", this);
  }

  // 将当前组件转换为 builder 类型的组件
  @recordMethod
  exchangeTo(builder: classType, args: any[]): Block[] {
    // @ts-ignore
    if (builder === this.constructor) return [this];
    return builder.exchange(this, args);
  }

  // 添加到某个组件内，被添加的组件必须为 StructureCollection 类型
  addInto(
    collection: StructureCollection<Block>,
    index?: number,
    customerUpdate: boolean = false
  ): operatorType {
    let newBlock = collection.addChildren([this], index, customerUpdate);
    return [newBlock[0], 0, 0];
  }

  // 从其父组件内移除
  removeSelf(customerUpdate: boolean = false): operatorType {
    this.parent?.removeChildren(this, 1, customerUpdate);
    return;
  }

  // 替换为另一个组件
  replaceSelf(
    block: Block | Block[],
    customerUpdate: boolean = false
  ): operatorType {
    if (!Array.isArray(block)) block = [block];
    let parent = this.getParent();
    let replaceBlock = parent.replaceChild(block, this, customerUpdate);
    return [replaceBlock[0], 0, 0];
  }

  // 添加子组件
  add(
    component: string | Component | Component[],
    index?: number,
    customerUpdate: boolean = false
  ): operatorType {
    return;
  }

  // 移除子组件
  remove(
    start?: number,
    end?: number,
    customerUpdate: boolean = false
  ): operatorType {
    return;
  }

  // 在 index 处切分
  split(
    index: number,
    component?: Component | Component[],
    customerUpdate: boolean = false
  ): operatorType {
    return;
  }

  indent(customerUpdate: boolean = false): operatorType {
    return;
  }

  outdent(customerUpdate: boolean = false): operatorType {
    return;
  }

  // 在一些组件中 Enter 被使用，导致不能在组件下方或上方创建新行
  // 使用该 api 创建上方或是下方的新行
  addEmptyParagraph(bottom: boolean): operatorType {
    return;
  }

  // 修改子组件的表现形式，仅在 ContentCollection 组件内有用
  modifyContentDecorate(
    start: number,
    end: number,
    style?: storeData,
    data?: storeData,
    customerUpdate: boolean = false
  ) {
    return;
  }

  // 将自己发送到另一组件
  sendTo(component: Component, customerUpdate: boolean = false): operatorType {
    return;
  }

  // 接收另一组件
  receive(
    component?: Component,
    customerUpdate: boolean = false
  ): operatorType {
    return;
  }

  snapshoot(): IBlockSnapshoot {
    let snap = super.snapshoot() as IBlockSnapshoot;
    snap.active = this.active;
    return snap;
  }

  restore(state: IBlockSnapshoot) {
    this.active = state.active;
    super.restore(state);
  }

  // 获取统计数据
  getStatistic() {
    return {
      word: 0,
      image: 0,
      audio: 0,
      video: 0,
      table: 0,
      list: 0,
      code: 0,
      block: 0
    };
  }

  // 当组件被选中时的行为，对外暴露，但不实现，由开发者定义行为
  onSelect(target?: Block): any {}
}

export default Block;
