// A表分成奇偶两个子表A,B。 A表做删除，B表做插入。
#include <iostream>
using namespace std;

template <class T>
struct Node{
    T data;
    Node<T>* next;
};

template <class T>
class List{
public:
    enum error_code{ success, arrange_error};
    List(){
        head = new Node<T>;
        count =0;
        head->next = nullptr;
        head->data = -100;
    }

    int length(){
        return count;
    }

    error_code get_element(int pos, T& x){
        if(pos<1 || pos > count+1)
            return arrange_error;
        Node<T>* p = head;
        for(int i=1;i<pos;++i){
            p = p->next;
        }
        x = p->next->data;
        return success;
    }

    error_code insert_node(int pos, T x){      //在pos前位置插入新节点。
        if(pos<1 || pos > count+1)
            return arrange_error;
        Node<T>* p = head;
        for(int i=1;i<pos;++i){
            p = p->next;
        }
        auto u = new Node<T>;
        u->data = x;
        u->next = p->next;
        p->next = u;
        count++;
        return success;
    }

    error_code delete_code(int pos){
        if(pos<1 || pos>count+1)
            return arrange_error;
        Node<T>* p =head;
        for(int i=1;i<pos;++i){
            p = p->next;
        }
        auto u = p->next;
        p->next = u->next;
        delete u;
        --count;
        return success;
    }

private:
    Node<int>* head;
    int count;
};


int main(){
    List<int> AList;
    for(int i=1;i<=9;++i){
        AList.insert_node(i,i);
    }
    for(int i=1;i<=AList.length();++i){       //AList中内容为 1,2,3,4,5,6,7,8,9
        int x = -100;
        AList.get_element(i,x);
        cout << x << " ";
    }

    List<int> BList;
    {       //此处为算法，实现让双数位置的节点，转移到新链表中
            for(int i= AList.length()/2*2 ; i>1 ; i-=2){
                int x = -100;
                AList.get_element(i,x);
                AList.delete_code(i);
                BList.insert_node(1,x);
            }
    }

    cout << endl;
    for(int i=1;i<=AList.length();++i){     // AList中内容为1,3,5,7,9
        int x = -100;
        AList.get_element(i,x);
        cout << x << " ";
    }
    cout << endl;
    for(int i=1;i<=BList.length();++i){ // AList中内容为2,4,6,8
        int x = -100;
        BList.get_element(i,x);
        cout << x << " ";
    }
}
