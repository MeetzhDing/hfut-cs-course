// 希尔排序
#include <iostream>
#include <random>
#include <vector>
#include <algorithm>
using namespace std;

template <class T>
void ShellSort(T& data,unsigned int len)
{
    if(len<=1)
        return;
    for(int div=len/2;div>=1;div=div/2)     //定增量div，并不断减小
    {
        for(int i=0;i<=div;++i)             //分组成div组
        {
            for(int j=i;j<len-div;j+=div)   //对每组进行插入排序
                for(int k=j;k<len;k+=div)
                    if(data[j]>data[k]){
                        auto tmp = data[j];
                        data[j] = data[k];
                        data[k] = tmp;
                    }
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
    ShellSort(vi,vi.size());
    cout << endl;
    for (int i = 0; i < size; i++)
        cout<<vi[i] << " ";
}