//哈希表构造与查找
#include <iostream>
#include <functional>
using namespace std;

template <class Key,class Value>
class HashTable{
public:
    explicit HashTable(int M = 16){
        this->M = M;
        keys = new Key[M]();
        vals = new Value[M]();
    }

    void put(Key key, Value val){
        if(N > M/2) resize(2*M);

        int i;
        for(i = hash(key); !keys[i].empty(); i = (i+1)%M ){
            if(keys[i] == key){
                vals[i] = val;
                return;
            }
        }
        keys[i] = key;
        vals[i] = val;
        this->N += 1;
    }

    Value get(Key key){
        for(int i = hash(key); !keys[i].empty(); i = (i+1)%M ){
            if(keys[i] == key){
                return vals[i];
            }
        }
        return Value();
    }

    void test(){
        cout << "显示table中的所有内容与位置\n";
        for(int i=0;i<M;i++){
            cout << i <<'\t'<< keys[i]<<'\t'<< vals[i]<< endl;
        }
        cout << endl;
    }

private:
    int N = 0;  //键值对总数
    int M = 16; //表大小
    Key* keys;
    Value* vals;
    std::hash<Key> hash_fn;

    int hash(Key key){
        return ((hash_fn(key)) % M) ;
    }

    void resize(int cap){
        HashTable<Key,Value> t(cap);
        for(int i=0; i < this->M;i++){
            if(vals[i]!= Value())
                t.put(keys[i],vals[i]);
        }
        delete(keys);
        delete(vals);
        keys = t.keys;
        vals = t.vals;
        M = t.M;
    }
};


int main(){
    HashTable<string,int> table;
    string str = "ABC";
    for(int i=1;i < 16/2;i++){
        table.put(str,i);
        str[0] += 1;
    }
    table.test();
    for(int i=9;i < 16;i++){
        str[0] += 1;
        table.put(str,i);
    }
    table.test();

    cout << "\n\n测试get函数\n";
    cout << table.get("ABC")<< ' ';
    cout << table.get("CAC")<< endl ;

}