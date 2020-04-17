//快速排序
#include <iostream>
#include <random>
#include <vector>
#include <algorithm>
using namespace std;

template <class T>
void QuickSort(T& data, int low,int high){
    if(low >= high) {
        return;
    }
    int first = low;
    int last = high;
    int key = data[first];
    while(first < last) {
        while(first < last && data[last] >= key) {
            --last;
        }
        data[first] = data[last];//将比中间元素小的移到低端
        while(first < last && data[first] <= key) {
            ++first;
        }
        data[last] = data[first];//将比中间元素大的移到高端
    }
    data[first] = key;
    QuickSort(data, low, first-1);
    QuickSort(data, first+1, high);
}

int main(){
    vector<int> vi;
    int size = 10;
    for (int i = 0; i < size; i++)
        vi.push_back(i);
    shuffle(vi.begin(), vi.end(), std::mt19937(std::random_device()()));   //对数组进行洗牌
    for (int i = 0; i < size; i++)
        cout<<vi[i] << " ";

    QuickSort(vi,0,vi.size()-1);
    cout << endl;
    for (int i = 0; i < size; i++)
        cout<<vi[i] << " ";

}