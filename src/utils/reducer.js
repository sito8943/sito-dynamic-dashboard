/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
export const localReducer = (localListState, action) => {
  const { type } = action;
  switch (type) {
    case "set": {
      const { elements, max, page } = action;
      return elements;
    }
    case "add": {
      const { elements } = action;
      const newArray = [...localListState];
      elements.forEach((item) => {
        if (!localListState.find((jtem) => jtem.id === item.id))
          newArray.push(item);
      });
      return newArray;
    }
    default:
      return [];
  }
};

export const imageReducer = (headerImageState, action) => {
  const { type } = action;
  switch (type) {
    case "set": {
      const { newArray } = action;
      return newArray;
    }
    case "add": {
      return [...headerImageState, { loading: true }];
    }
    case "set-loading": {
      const { index } = action;
      headerImageState[index].loading = true;
      return [...headerImageState];
    }
    case "set-image": {
      const { url, fileId, blurHash } = action;
      headerImageState[headerImageState.length - 1].url = url;
      headerImageState[headerImageState.length - 1].fileId = fileId;
      headerImageState[headerImageState.length - 1].blurHash = blurHash;
      headerImageState[headerImageState.length - 1].loading = false;
      return [...headerImageState];
    }
    case "remove": {
      const { index } = action;
      const newArray = [...headerImageState];
      newArray.splice(index, 1);
      return newArray;
    }
    default:
      return [];
  }
};
