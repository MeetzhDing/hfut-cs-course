function shellSort(arr){
    let len = arr.length;
    for(let gap = Math.floor(len/2); gap>0; gap = Math.floor(gap/2)){
        for(let i = gap; i<len; i++){
            for(let j = i-gap; j>=0 && arr[j]>arr[j+gap]; j-=gap){
                [arr[j], arr[j+gap]] = [arr[j+gap], arr[j]];
            }
            console.log(arr);
        }
    }
    return arr;
}

var arr = [9, 38, 65, 97, 76, 13, 27, 49, 55, 04];
console.log(arr);
console.log('');

console.log(shellSort(arr));