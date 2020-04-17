//归并排序
#include <iostream>
#include <random>
#include <vector>
#include <algorithm>
using namespace std;

//将有序的list[low...mid]copy 到 help[low...mid]
//然后将help[low...mid]和list[mid+1..high]按从下到大归并到list[low...high]
template<typename T>
void Merge(T& list, T& help, int low, int mid, int high) {
    int i = low; //i用于循环help[low...mid]中的元素
    int j = mid + 1; //j用于循环list[mid+1...high]中的元素
    int k = low; //k用于循环list[low...high]中的元素
    while(i <= mid){ //list[low...mid] copy 到 help[low...mid]
        help[i] = list[i];
        ++i;
    }
    i = low;
    while(i <= mid && j <= high) {
        if(help[i] <= list[j]) {
            list[k++] = help[i++];
        } else {
            list[k++] = list[j++];
        }
    }
    while(i <= mid) {
        list[k++] = help[i++]; //将剩余的help[i...mid]复制到list中
    }
}

template<typename T>
void MergeSort(T& arr, T& help, int low, int high) {
    if(low < high) {
        int mid = (high - low)/2 + low;
        MergeSort(arr, help, low, mid);
        MergeSort(arr, help, mid +1, high);
        Merge(arr,help,low, mid, high);
    }
}

template<typename T>
void MergeSort(T& arr ,int length) {
    T temp = arr;
    MergeSort(arr, temp, 0, length-1);
}

int main(){
    vector<int> vi;
    int size = 101;
    for (int i = 0; i < size; i++)
        vi.push_back(i);
    shuffle(vi.begin(), vi.end(), std::mt19937(std::random_device()()));   //对数组进行洗牌
    for (int i = 0; i < size; i++)
        cout<<vi[i] << " ";
    MergeSort(vi,vi.size());
    cout << endl;
    for (int i = 0; i < size; i++)
        cout<<vi[i] << " ";

}