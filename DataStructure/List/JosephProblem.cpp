//Joseph problem，约瑟夫环，敢死队存活问题
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
private:
    int count;
    Node<int>* head;
};

//int cir(int n,int m)  //直接算法，无需使用链表实验
//{
//    int p=0;
//    for(int i=2;i<=n;i++)
//    {
//        p=(p+m)%i;
//    }
//    return p+1;
//}

int main(){
    List<int> iList;
    int n=11,m=3;       //可由用户输入
    for(int i=n;i>=1;--i){
        iList.insert_node(1,i-1);
    }

    int i=(m-1)%iList.length();       //i=0是链表的第一个有效元素，方便求余数操作
    while (iList.length()>1){
        iList.delete_node(i+1);
        i = (i+m-1)%iList.length();
    }

    int x;
    iList.get_element(1,x);
    cout << "队伍初始人数为"<< n <<",跳跃间隔为" << m <<"的情况下"<< endl << "队长为保证存活，应保证序号为" << x+1;
//    也就是说，队长应当从队伍前第x人开始计数，以下是几组样例结果：
//    x = f(2,3) = 0
//    x = f(2,3) = 1
//    x = f(2,3) = 1
//    x = f(2,3) = 0
//    x = f(2,3) = 6
}