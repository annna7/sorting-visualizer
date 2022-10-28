import React from 'react';
import './SortingVisualizer.css'

function getRandomIntFromInterval(number1, number2) {
    return Math.floor(Math.random() * (number2 - number1 + 1) + number1);
}

const sleep = (millisecond) => {
    return new Promise((resolve) => setTimeout(resolve, millisecond));
};

const ARRAY_SIZE = 150;
const DEFAULT_DELAY = 5;
const PRIMARY_COLOR = "darkgreen";
const HIGHLIGHT_COLOR = "red";
const MIN_VALUE = 10;
const MAX_VALUE = 210;

export default class SortingVisualizer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: [],
            delay: DEFAULT_DELAY,
        };
    }

    // called immediately after a component is mounted
    componentDidMount() {
        this.resetArray();
    }

    resetArray() {
        const arr = [];
        for (let i = 0; i < ARRAY_SIZE; ++i) {
            let node = {
                value: getRandomIntFromInterval(MIN_VALUE, MAX_VALUE),
                color: PRIMARY_COLOR,
            }
            arr.push(node);
        }
        this.setState({array: arr});
    }

    bubbleSort(arr1) {
        let arr = JSON.parse(JSON.stringify(arr1));
        let isSorted = false;
        let swapsToMake = [];

        while (!isSorted) {
            isSorted = true;
            for (let i = 0; i < ARRAY_SIZE - 1; ++i) {
                if (arr[i].value > arr[i + 1].value) {
                    isSorted = false;
                    [arr[i].value, arr[i + 1].value] = [arr[i + 1].value, arr[i].value];
                    swapsToMake.push([i, i + 1]);
                }
            }
        }

        console.log(swapsToMake);
        console.log(arr);
        console.log(arr1);
        return swapsToMake;
    }

    selectSort(arr1) {
        let arr = JSON.parse(JSON.stringify(arr1));
        let maxPos;
        let swapsToMake = [];
        for (let j = ARRAY_SIZE - 1; j >= 0; --j) {
            maxPos = 0;
            for (let i = 0; i <= j; ++i) {
                if (arr[i].value > arr[maxPos].value) maxPos = i;
            }
            [arr[maxPos].value, arr[j].value] = [arr[j].value, arr[maxPos].value];
            swapsToMake.push([j, maxPos]);
        }
        return swapsToMake;
    }

    quickSortHelper(arr) {
        let new_arr = JSON.parse(JSON.stringify(arr));
        return this.quickSort(new_arr, 0, ARRAY_SIZE - 1);
    }

    hoarePartition(arr, st, dr) {
        let pivotIndex = Math.floor(st + Math.random() * (dr - st + 1));
        let pivot = arr[pivotIndex].value;
        let i = st - 1, j = dr + 1;
        let swapsToMake = [];
        while (true) {
            do
                ++i;
            while (arr[i].value < pivot);
            do
                --j;
            while (arr[j].value > pivot);
            if (i >= j) return [j, swapsToMake];
            [arr[i].value, arr[j].value] = [arr[j].value, arr[i].value];
            swapsToMake.push([i, j]);
        }
    }

    quickSort(arr, st, dr) {
        if (st < dr) {
            let partitionResult = this.hoarePartition(arr, st, dr);
            let pivot = partitionResult[0];
            let finalRes = partitionResult[1].concat(this.quickSort(arr, st, pivot), this.quickSort(arr, pivot + 1, dr));
            return finalRes;
        }
        return [];
    }

    /*
    mergeSortHelper(arr) {
        let new_arr = JSON.parse(JSON.stringify(arr));
        return this.mergeSort(new_arr, 0, ARRAY_SIZE - 1);
    }
    
    mergeSort(arr, st, dr) {
        if (st < dr) {
            let middle = Math.floor(st + (dr - st) / 2);
            let finalRes = this.mergeSort(arr, st, middle).concat(this.mergeSort(arr, middle + 1, dr), this.mergeHalves(arr, st, dr));
            return finalRes;
        }
        return [];
    }

    mergeHalves(arr, st, dr) {
        let middle = Math.floor(st + (dr - st) / 2);
        let n1 = middle - st + 1;
        let n2 = dr - middle;

        let arr1 = new Array(n1), arr2 = new Array(n2);

        let swapsToMake = [];

        for (let i = 0; i < n1; ++i)
            arr1[i] = arr[st + i];

        for (let j = 0; j < n2; ++j)
            arr2[j] = arr[middle + 1 + j];

        let i = 0, j = 0, k = st;
        
        while (i < n1 && j < n2) {
            if (arr1[i].value <= arr2[j].value) {
                arr[k] = arr1[i];
                swapsToMake.push([i + st, k]);
                ++i;
                ++k;
            }
            else {
                arr[k] = arr2[j];
                swapsToMake.push([j + middle + 1, k]);
                ++j;
                ++k;
            }
        }
        
        while (i < n1) {
            arr[k] = arr1[i];
            swapsToMake.push([i + st, k]);
            ++i;
            ++k;
        }
        
        while (j < n2) {
            arr[k] = arr2[j];
            swapsToMake.push([j + middle + 1, k]);
            ++j;
            ++k;

        }

        return swapsToMake;
    }

*/
    async showSorting(swapsToMake) {
        let arr = this.state.array;
        for (let i = 0; i < swapsToMake.length; ++i) {
            let firstIndex = swapsToMake[i][0];
            let secondIndex = swapsToMake[i][1];
            arr[firstIndex].color = arr[secondIndex].color = HIGHLIGHT_COLOR;
            [arr[firstIndex].value, arr[secondIndex].value] = [arr[secondIndex].value, arr[firstIndex].value];
            this.setState({array: arr});
            await sleep(this.delay);
            arr[firstIndex].color = arr[secondIndex].color = PRIMARY_COLOR;
            this.setState({array: arr});
        }
    }


    render() {
        const arr = this.state.array;

        return (
            <div className="result">
                <div className="element-container">
                    {arr.map((element, index) => (
                        <div
                            className="element-bar"
                            key={index}
                            id={index}
                            style={{height:`${element.value}px`,
                                    backgroundColor: element.color}
                        }
                        ></div>
                    ))}
                </div>
                <div className="options">
                    <button onClick={() => this.resetArray(this.state.array)}>Reset Array</button>
                    <p></p>
                    <span>&nbsp;Select an algorithm:&nbsp;</span>
                    <button onClick={() => this.showSorting(this.bubbleSort(this.state.array))}>bubble sort</button>
                    <span>&nbsp;</span>
                    <button onClick={() => this.showSorting(this.selectSort(this.state.array))}>select sort</button>
                    <span>&nbsp;</span>
                    <button onClick={() => this.showSorting(this.quickSortHelper(this.state.array))}>quick sort</button>
                    <span>&nbsp;</span>
                </div>
            </div>
        );
    }
}
