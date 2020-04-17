// 冒泡排序
#include <iostream>
#include <random>
#include <vector>
#include <algorithm>
using namespace std;

template <class T>
void BubbleSort(T& data, unsigned int length){
    int i =1;
    int n = length;
    bool exchanged = true;
    do{
        exchanged = false;
        for(int j=n-1; j>=i ;j--){
            if(data[j] < data[j-1]){
                auto tmp = data[j];
                data[j] = data[j-1];
                data[j-1] = tmp;
                exchanged = true;
            }
        }
        i += 1;
    }while(i<=n && exchanged);
}

int main(){
    vector<int> vi;
    int size = 100;
    for (int i = 0; i < size; i++)
        vi.push_back(i);
    shuffle(vi.begin(), vi.end(), std::mt19937(std::random_device()()));   //对数组进行洗牌
    for (int i = 0; i < size; i++)
        cout<<vi[i] << " ";
    BubbleSort(vi,vi.size());
    cout << endl;
    for (int i = 0; i < size; i++)
        cout<<vi[i] << " ";
}