//选择排序
#include <iostream>
#include <random>
#include <vector>
#include <algorithm>
using namespace std;

template <class T>
void SelectSort(T &data, unsigned int length){
    int i,j,min;
    for(i=0;i<length-1;i++) {
        min=i;              //查找最小值
        for(j=i+1;j<length;j++)
            if(data[min]>data[j])
                min=j;      //交换
        if(min!=i) {
            auto tmp=data[min];
            data[min]=data[i];
            data[i]=tmp;
        }
    }
}

int main(){
    vector<int> vi;
    int size = 100;
    for (int i = 0; i < size; i++)
        vi.push_back(i);
    shuffle(vi.begin(), vi.end(), std::mt19937(std::random_device()()));   //对数组进行洗牌
    for (int i = 0; i < size; i++)
        cout<<vi[i] << " ";
    SelectSort(vi, vi.size());
    cout << endl;
    for (int i = 0; i < size; i++)
        cout<<vi[i] << " ";

}