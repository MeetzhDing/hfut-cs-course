// 二分查找
#include <iostream>
#include <vector>
#include <utility>
using namespace std;

template<class T>
int BinSearch(vector<T>& seq, T key, int start=0, int end=0){
    if(end==0)
        end = seq.size();
    if(start > end)
        return -1;
    int mid,low=start,high=end;
    while(low<=high){
        mid = low+(high-low)/2;
        if(seq[mid]==key)
            return mid;
        else if(key < seq[mid]) high=mid-1;
        else if(key > seq[mid]) low=mid+1;
    }
    return -1;
}

int main(){
    vector<int> vec;
    for(int i=0;i<100;i++){
        vec.push_back(i*2);
    }
    cout << BinSearch(vec, 36)<<endl;
    cout << BinSearch(vec, 100)<<endl;
    cout << BinSearch(vec, 101)<<endl;
}