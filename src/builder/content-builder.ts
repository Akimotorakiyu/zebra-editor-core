import ComponentType from "../const/component-type";
import StructureType from "../const/structure-type";

export interface mapData {
  [key: string]: any;
}

export default {
  buildArticle(
    id: string,
    componentList: HTMLElement[],
    style: mapData,
    data: mapData
  ): HTMLElement {
    const article = document.createElement("article");
    article.id = id;
    article.classList.add("zebra-draft-article");
    article.dataset.type = ComponentType.article;
    article.dataset.structure = StructureType.collection;
    componentList.forEach((component) => {
      article.appendChild(component);
    });
    return article;
  },
  buildList(
    id: string,
    componentList: HTMLElement[],
    style: mapData,
    data: mapData
  ): HTMLElement {
    let tag = data.tag || "ul";
    const list = document.createElement(tag);
    list.id = id;
    list.classList.add("zebra-draft-list");
    list.dataset.type = ComponentType.article;
    list.dataset.structure = StructureType.collection;
    componentList.forEach((component) => {
      list.appendChild(component);
    });
    return list;
  },
  buildParagraph(
    id: string,
    inlineList: HTMLElement[],
    style: mapData,
    data: mapData
  ): HTMLElement {
    let tag = data.tag || "p";
    const parapraph = document.createElement(tag);
    parapraph.id = id;
    parapraph.classList.add(`zebra-draft-${tag}`);
    parapraph.dataset.type = ComponentType.paragraph;
    parapraph.dataset.structure = StructureType.content;
    if (inlineList.length) {
      inlineList.forEach((component) => {
        parapraph.appendChild(component);
      });
    } else {
      parapraph.appendChild(document.createElement("br"));
    }
    if (style) {
      for (let key in style) {
        parapraph.style[key] = style[key];
      }
    }
    return parapraph;
  },
  buildTitle(
    id: string,
    inlineList: HTMLElement[],
    style: any,
    data: any
  ): HTMLElement {
    let type = data.tag.toLocaleLowerCase() || "h1";
    const title = document.createElement(type);
    title.id = id;
    title.classList.add(`zebra-draft-title-${type}`);
    title.dataset.type = type;
    title.dataset.structure = StructureType.content;
    if (inlineList.length) {
      inlineList.forEach((component) => {
        title.appendChild(component);
      });
    } else {
      title.appendChild(document.createElement("br"));
    }
    if (style) {
      for (let key in style) {
        title.style[key] = style[key];
      }
    }
    return title;
  },
  buildeImage(id: string, src: string, style: mapData, data: mapData) {
    const figure = document.createElement("figure");
    figure.id = id;
    figure.classList.add("zebra-draft-image", "zebra-draft-image-loading");
    figure.dataset.type = ComponentType.image;
    figure.dataset.structure = StructureType.content;
    let child;
    let image = document.createElement("img");
    image.src = src;
    image.alt = data.alt || "";
    image.addEventListener("load", () => {
      setTimeout(() => {
        figure.classList.remove("zebra-draft-image-loading");
      }, 300);
    });
    if (data.link) {
      const link = document.createElement("a");
      link.href = data.link;
      link.appendChild(image);
      child = link;
    } else {
      child = image;
    }
    figure.appendChild(child);
    return figure;
  },
  buildeAudio(id: string, src: string, style: mapData, data: mapData) {
    const figure = document.createElement("figure");
    figure.id = id;
    figure.classList.add("zebra-draft-image");
    figure.dataset.type = ComponentType.audio;
    figure.dataset.structure = StructureType.content;
    let audio = document.createElement("audio");
    audio.src = src;
    figure.appendChild(audio);
    return figure;
  },
  buildeVideo(id: string, src: string, style: mapData, data: mapData) {
    const figure = document.createElement("figure");
    figure.id = id;
    figure.classList.add("zebra-draft-image");
    figure.dataset.type = ComponentType.video;
    figure.dataset.structure = StructureType.content;
    let video = document.createElement("video");
    video.src = src;
    figure.appendChild(video);
    return figure;
  },
  buildCharacterList(
    id: string,
    charList: string[],
    style: mapData
  ): HTMLElement {
    const span = document.createElement("span");
    span.id = id;
    span.dataset.type = ComponentType.characterList;
    span.dataset.structure = StructureType.partialContent;
    span.innerText = charList.join("");
    if (style) {
      for (let key in style) {
        span.style[key] = style[key];
      }
    }
    return span;
  },
  buildInlineImage(
    id: string,
    src: string,
    style: mapData,
    data: mapData
  ): HTMLElement {
    const span = document.createElement("span");
    span.id = id;
    span.classList.add("zebra-draft-inline-image", "zebra-draft-image-loading");
    span.dataset.type = ComponentType.inlineImage;
    span.dataset.structure = StructureType.partialContent;
    let child;
    let image = document.createElement("img");
    image.src = src;
    image.alt = data.alt || "";
    image.addEventListener("load", () => {
      span.classList.remove("zebra-draft-image-loading");
    });
    image.addEventListener("error", () => {
      span.classList.remove("zebra-draft-image-loading");
    });
    if (data.link) {
      const link = document.createElement("a");
      link.href = data.link;
      link.appendChild(image);
      child = link;
    } else {
      child = image;
    }
    span.appendChild(child);
    return span;
  },
};