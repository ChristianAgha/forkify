// Converts fractals to decimals
export const fractToDecimal = fractVal => {
    //console.log(fractVal);
    let x, y;
    if (Array.isArray(fractVal)) {
      x = fractVal;
    } else if (fractVal.includes('-') || fractVal.includes('/')) {
      x = fractVal.includes('-') ? fractVal.split('-') : fractVal.split(' ');
    } else {
      return parseInt(fractVal);
    }
   
    if (x.length > 1 && !x[0].includes('/')) {
      y = x[1].split('/');
      const numY = y[0] / y[1];
      const numX = parseInt(x[0]);

      return (numX + numY);//.toFixed(1);
    } else {
      y = x[0].split('/');
   
      return y[0] / y[1];
      //return parseFloat(`${y[0] / y[1]}`).toFixed(2);
    }
  };