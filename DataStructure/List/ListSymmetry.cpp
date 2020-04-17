//程序实现功能，检测双链表内容是否对称
#include <iostream>
using namespace std;

template <class T>
struct Node {
    T data;
    struct Node<T> *prior, *next;
} ;

template <class T>
class List{
public:
    enum error_code{ success,arrange_error };
    List(){
        count = 0;
        head = new Node<T>;
        head->next = head;
        head->prior = head;
    }
    int length() const{
        return count;
    }
    error_code get_element(const int i,T &x) const{
        if(i<1 || i>count+1) return arrange_error;
        Node<T>* p = head;
        int j =0;
        while(j!=i && j<count){
            p = p->next;
            j++;
        }
        x = p->data;
        return success;
    }
    Node<T>* locate(const T& x) const {
        Node<T>* p;
        p = head->next;
        while (p!=head)
            if(p->data == x) return p;
            else p=p->next;
        return NULL;
    }
    error_code insert_node(const int i, const T x ){ //在第i号位置节点前插入
        if(i<1 || i>count+1) return arrange_error;
        Node<T>* p = head;
        int j=0;
        while (j!=i-1 && j<count){
            p=p->next;
            j++;
        }
        Node<T>* ptr = new Node<T>;
        ptr->data = x;
        ptr->prior = p;
        ptr->next = p->next;
        p->next = ptr;
        ptr->next->prior = ptr;
        ++count;
        return success;
    }
    error_code delete_node(const int i){
        Node<T>* p=head;
        int j=0;
        while(j!=i-1 && j<count){
            p=p->next;
            j++;
        }
        if(i<1||i>count)
            return arrange_error;
        Node<T>* u = p->next;
        p->next = u->next;
        p->next->prior = p;
        delete u;
        count--;
        return success;
    }
    void reverse(){         //原地逆置算法，同样适合用于单链表
        if(count <= 1)  //如果只有一个节点，那么无需逆置
            return;
        auto p = head;      //逆置所有next指针
        auto u = p->next;
        auto v = u->next;
        auto w = v->next;
        do{
            u->next = p;
            p = u;
            u = v;
            v = v->next;
        }while(p!=head);

        p=head;             //逆置所有prior指针
        u = p->prior;
        v = u->prior;
        do{
            u->prior = p;
            p = u;
            u = v;
            v = v->prior;
        }while(p!=head);
    }

    bool symmetry(){
        int length = count;
        if(length<=1) return true;
        auto p = head;
        auto u = head;
        while (length>0){
            p = p->next;
            u = u->prior;
            if(p->data != u->data)
                return false;
            length -= 2;
        }
        return true;
    }
private:
    int count;
    Node<int>* head;
};




int main(){
    List<int> iList;
    for(int i=1;i<=6;++i){      //链表内容为6,5,4,3,2,1,
        iList.insert_node(1,i);
    }
    for(int i=5;i>=1;--i){      //链表内容为1,2,3,4,5,6,5,4,3,2,1
        iList.insert_node(1,i);
    }

    if(iList.symmetry())
        cout << "List is symmetrical";
    else
        cout << "List is not symmetrical";
}