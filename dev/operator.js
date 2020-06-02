import "./index.scss";

import article from "./index";
import updateComponent from "../src/selection-operator/update-component";
import modifySelectionDecorate from "../src/selection-operator/modify-selection-decorate";
import input from "../src/selection-operator/input";
import ComponentType from "../src/const/component-type";
import insertBlock from "../src/selection-operator/insert-block";
import exchangeParagraph from "../src/selection-operator/exchange-paragraph";
import Paragraph from "../src/components/paragraph";
import modifyComponentDecorate from "../src/selection-operator/modify-component-decorate";
import Title from "../src/components/title";
import Media from "../src/components/media";
import InlineImage from "../src/components/inline-image";
import { ListItem } from "../src/components/list";
import getHtml from "../src/util/get-html";
import Table from "../src/components/table";
import setTableSize from "../src/selection-operator/set-table-size";

new Vue({
  el: "#operator",
  template: "#operator-template",
  data() {
    return {
      inlineStyle: "fontSize",
      inlineStyleValue: "20px",
      blockStyle: "lineHeight",
      blockStyleValue: "2em",
      inlineImage: "",
      image: "",
      tableRow: 3,
      tableCol: 3,
      tableHead: true
    };
  },
  methods: {
    showArticle() {
      updateComponent(article);
    },
    logHtml() {
      console.log(getHtml(article));
    },

    modifyType(tag) {
      if (tag === "normal") {
        exchangeParagraph(Paragraph, tag);
      } else if (tag === "ul" || tag === "ol") {
        exchangeParagraph(ListItem, tag);
      } else {
        exchangeParagraph(Title, tag);
      }
    },

    bold() {
      modifySelectionDecorate({ fontWeight: "bold" });
    },
    deleteType() {
      modifySelectionDecorate({ textDecoration: "line-through" });
    },
    itailc() {
      modifySelectionDecorate({ fontStyle: "italic" });
    },
    red() {
      modifySelectionDecorate({ color: "red" });
    },
    clearStyle() {
      modifySelectionDecorate({ clear: "style" });
    },
    customerInlineStyle() {
      if (this.inlineStyle && this.inlineStyleValue) {
        modifySelectionDecorate({ [this.inlineStyle]: this.inlineStyleValue });
      }
    },

    modifyStyle(name, value) {
      modifyComponentDecorate({ [name]: value });
    },
    customerBlockStyle() {
      if (this.blockStyle && this.blockStyleValue) {
        modifyComponentDecorate({ [this.blockStyle]: this.blockStyleValue });
      }
    },

    addTable() {
      insertBlock(new Table(3, 3));
    },
    modifyTable() {
      setTableSize({
        row: this.tableRow,
        col: this.tableCol,
        head: this.tableHead
      });
    },

    insertInlineImage() {
      let index = Math.floor(Math.random() * 56 + 1);
      input(
        new InlineImage(
          `http://cdn.acohome.cn/${index}.png?imageMogr2/auto-orient/thumbnail/x20`
        )
      );
    },
    customerInlineImage() {
      input(new InlineImage(this.inlineImage));
    },

    insertImage() {
      let index = Math.random() > 0.5 ? 1 : 3;
      insertBlock(
        new Media(
          ComponentType.image,
          `https://blogcdn.acohome.cn/demo-draft-${index}.jpg`
        )
      );
    },
    customerImage() {
      insertBlock(new Media(ComponentType.image, this.image));
    }
  }
});
