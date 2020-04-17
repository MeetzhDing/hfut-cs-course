#include <iostream>
#include <random>
#include <algorithm>

using namespace std;
template <class T>
void InsertSort (T& A, int length, int start = 1){ // A[0]用作监视哨
    for(int i=start+1; i < start+length; i++){
        A[0] = A[i];
        int j = i-1;
        while(A[j] > A[0]){
            A[j+1] = A[j];
            j = j-1;
        }
        A[j+1] = A[0];
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
    InsertSort(vi,vi.size());
    cout << endl;
    for (int i = 0; i < size; i++)
        cout<<vi[i] << " ";
}
