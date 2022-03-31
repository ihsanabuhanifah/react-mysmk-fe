

const getOptions = (array, text) => {
    const options = [];

    console.log("sss", array);
  
    array?.map((data, index) => {
      let option = {
        key: index,
        value: data.id,
        text: data[`${text}`],
      };
      options.push(option);
    });
  
    return options;
}

export {getOptions}