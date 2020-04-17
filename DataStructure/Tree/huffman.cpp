//huffman
#include <iostream>
#include <list>
#include <map>
#include <deque>
#include <vector>
#include <stack>
#include <utility>
#include <algorithm>

using namespace std;


template <class T>
struct BNode{
    T data = T();
    int weight = 0;
    BNode* lChild= nullptr;
    BNode* rChild= nullptr;
};

template <class T>
class Huffman{
public:
    typedef BNode<T> node;
    Huffman() = default;
    explicit Huffman(map<T,int> mapData){
        this->data = mapData;
//        this->size = mapData.size();
        for(auto i : mapData){
            auto tmp = new node();
            tmp->data = i.first;
            tmp->weight = i.second;
            nodeQue.push_back(tmp);
        }
        this->construct();
    }

    void construct(){
        while(nodeQue.size() > 1){
            sort(nodeQue.begin(),nodeQue.end(),[](node* x,node* y){ return x->weight < y->weight;});
            auto left = nodeQue.front();
            nodeQue.pop_front();
            auto right = nodeQue.front();
            nodeQue.pop_front();
            auto tmp = new node();
            tmp->lChild = left;
            tmp->rChild = right;
            tmp->weight = left->weight + right->weight;
            nodeQue.push_front(tmp);
        }
        this->root = nodeQue.front();
    }

    map<char,string> output(){
        travel(this->root, "");
        return this->msg;
    }

    void travel(node* n, string str){
        if(n->data==T()){
            travel(n->lChild,str+'0');
            travel(n->rChild,str+'1');
        } else {
            this->msg[n->data] = str;
        }
    }

private:
    node* root = nullptr;
    deque<node*> nodeQue;
    map<T,int> data;
    map<char,string> msg;
//    int size = 0;
};

int main(){
    //假设某文件中有8个字符，从A到H，出现的次数为3,4,8,10,16,18,20,21，对其重新编码
    std::map<char,int> data;
    data.insert(make_pair('A',3));
    data.insert(make_pair('B',4));
    data.insert(make_pair('C',8));
    data.insert(make_pair('D',10));
    data.insert(make_pair('E',16));
    data.insert(make_pair('F',18));
    data.insert(make_pair('G',20));
    data.insert(make_pair('H',21));
    Huffman<char> huf(data);
    auto msg = huf.output();
    for(auto i : msg){
        cout << i.first << ": " << i.second << endl;
    }
    cout << endl;
}