//堆排序 从小到大 大根堆
#include <iostream>
#include <random>
#include <vector>
#include <algorithm>
using namespace std;

template<typename T>
void MaxHeapify(T &data, int k, int m) {
    int i = k;
    int j=k*2+1;
    auto x = data[k];
    bool finished = false;
    while(j<=m && !finished){
        if(j<m && data[j] < data[j+1])
            j += 1;
        if(x > data[j]){
            finished = true;
        }
        else{
            data[i] = data[j];
            i = j;
            j = j*2+1;
        }
    }
    data[i] = x;
}

template<typename T>
void MinHeapify(T &data, int k, int m) {
    int i = k;
    int j=k*2+1;
    auto x = data[k];
    bool finished = false;
    while(j<=m && !finished){
        if(j<m && data[j] > data[j+1])
            j += 1;
        if(x < data[j]){
            finished = true;
        }
        else{
            data[i] = data[j];
            i = j;
            j = j*2+1;
        }
    }
    data[i] = x;
}

template<typename T>
void HeapSort(T& data,int size,bool inc= true) {
    void (*Heapify)(T& data,int,int) = MaxHeapify;
    if(!inc)
        Heapify = MinHeapify;
    int i;
    for(i=size/2;i>=0;i--){//从子树开始整理树
        Heapify(data,i,size-1);
    }
    cout << endl;
    for (int t = 0; t < size; t++)
        cout<<data[t] << " ";
    while(size>=1){//拆除树
        swap(data[size-1],data[0]); //将根 与数组最末交换
        size--;                     //树大小减小
        Heapify(data,0,size-1);       //整理树
    }
}

int main(){
    vector<int> vi;
    int size = 101;
    for (int i = 0; i < size; i++)
        vi.push_back(i);
    shuffle(vi.begin(), vi.end(), std::mt19937(std::random_device()()));   //对数组进行洗牌
    for (int i = 0; i < size; i++)
        cout<<vi[i] << " ";
    HeapSort(vi,vi.size(), true);
    cout << endl;
    for (int i = 0; i < size; i++)
        cout<<vi[i] << " ";
}