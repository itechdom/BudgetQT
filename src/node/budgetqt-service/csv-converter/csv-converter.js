function csvFormater(arr){
  let tempArr = [];
  let csvRows = arr.map((row,index)=>{
    if(index === 0){
      return Object.keys(row).map((key)=>{
        return key;
      });
    }
    return Object.keys(row).map((key)=>{
      return row[key];
    });
  });
  return csvRows;
}

export default function csvConverter(arr){
  let csvFile = '';
  csvFormater(arr).map((row)=>{
    csvFile += row.reduce((prev, curr) => `${prev},${curr}\n`);
  });
  return csvFile;
}
