// 树的孩子兄弟表示法
#include <iostream>
#include <list>
#include <vector>
#include <stack>

using namespace std;

template <class T>
struct Node{
    T data = T();
    Node* firstSon= nullptr;
    Node* nextBro= nullptr;
};

template <class T>
class Tree{
public:
    typedef Node<T> node;
    explicit Tree() = default;

    ~Tree(){
        deleteTree(this->root);
    }

    bool deleteNode(T data){
        if(this->root->data == data){
            deleteTree(this->root);
            this->root = nullptr;
            return true;
        }
        auto loc = locateFather(data, root);
        if(loc!= nullptr){
            if(loc->firstSon->data ==data) {
                deleteTree(loc->firstSon);
                loc->firstSon = nullptr;
            } else {
                deleteTree(loc->nextBro);
                loc->nextBro = nullptr;
            }
            return true;
        }
    }

    bool insertSon(T pos, T data){
        if(this->size==0) {
            root = new node;
            root->data = data;
            size += 1;
            return true;
        }
        node* loc = locate(pos);
        node* exist = locate(data);
        if(!loc || exist)
            return false;
        if(loc->firstSon == nullptr){
            loc->firstSon = new node;
            loc->firstSon->data = data;
        } else{
            node* son = loc->firstSon;
            while(son->nextBro!= nullptr)
                son = son->nextBro;
            son->nextBro = new node;
            son->nextBro->data = data;
        }
        this->size += 1;
        return true;
    }

    bool insertBro(T pos, T data){
        if(this->size==0 || locate(pos)== nullptr)
            return false;
        node* loc = locate(pos);
        if(loc->nextBro== nullptr){
            loc->nextBro = new node;
            loc->nextBro->data = data;
        } else {
            auto n = new node;
            n->nextBro = loc->nextBro;
            n->data = data;
            loc->nextBro = n;
        }
        this->size += 1;
        return true;
    }

    node* locate(T data) const {
        return locate(data, root);
    }

    vector<T> preOrder(){
        pubVec.clear();
        preOrder(root);
        return pubVec;
    }

    vector<T> inOrder(){
        pubVec.clear();
        inOrder(root);
        return pubVec;
    }

    vector<T> postOrder(){
        pubVec.clear();
        postOrder(root);
        return pubVec;
    }

private:
    node* root = nullptr;
    int size = 0;
    vector<T> pubVec;

    node* locate(T data, node* n) const {
        stack<node*> s;
        node *p=this->root;
        while(p!=nullptr||!s.empty())
        {
            while(p!=nullptr)
            {
                if(p->data == data)
                    return p;
                s.push(p);
                p=p->firstSon;
            }
            if(!s.empty())
            {
                p=s.top();
                s.pop();
                p=p->nextBro;
            }
        }
        return nullptr;
    }

    node* locateFather(T data, node* n){
        stack<node*> s;
        node *p=this->root;
        while(p!=nullptr||!s.empty())
        {
            while(p!=nullptr)
            {
                if(p->firstSon != nullptr &&  p->firstSon->data == data
                   || p->nextBro != nullptr && p->nextBro->data == data)
                    return p;
                s.push(p);
                p=p->firstSon;
            }
            if(!s.empty())
            {
                p=s.top();
                s.pop();
                p=p->nextBro;
            }
        }
    }

    void deleteTree(node* r){
        if(r == nullptr) return;
        deleteTree(r->firstSon);
        deleteTree(r->nextBro);
        delete r;
    }

    void visit(node *r){
        pubVec.push_back(r->data);
    }

    void preOrder(node *r){
        stack<node*> s;
        node *p= r;
        while( p!= nullptr || !s.empty() )
        {
            while(p!= nullptr)
            {
                this->visit(p);
                s.push(p);
                p=p->firstSon;
            }
            if(!s.empty())
            {
                p=s.top();
                s.pop();
                p=p->nextBro;
            }
        }
    }
    void inOrder(node* r){
        stack<node*> s;
        node *p = r;
        while(p != nullptr|| !s.empty())
        {
            while(p != nullptr)
            {
                s.push(p);
                p=p->firstSon;
            }
            if(!s.empty())
            {
                p=s.top();
                this->visit(p);
                s.pop();
                p=p->nextBro;
            }
        }
    }

    void postOrder(node* r){  //非递归后序遍历
        stack<node*> s;
        node* cur;                      //当前结点
        node* pre= nullptr;                 //前一次访问的结点
        s.push(r);
        while(!s.empty())
        {
            cur=s.top();
            if((cur->firstSon== nullptr && cur->nextBro== nullptr)||
               (pre!= nullptr && (pre==cur->firstSon||pre==cur->nextBro)))
            {
                this->visit(cur);  //如果当前结点没有孩子结点或者孩子节点都已被访问过
                s.pop();
                pre=cur;
            } else {
                if(cur->nextBro!= nullptr)
                    s.push(cur->nextBro);
                if(cur->firstSon!= nullptr)
                    s.push(cur->firstSon);
            }
        }
    }
};

int main(){
    Tree<char> tree;
    tree.insertSon(0, 'A');
    tree.insertSon('A', 'B');
    tree.insertSon('A', 'C');
    tree.insertBro('C', 'D');
    tree.insertSon('C', 'H');
    tree.insertBro('H', 'I');
    tree.insertSon('D', 'J');
    tree.insertSon('B', 'E');
    tree.insertBro('E', 'F');
    tree.insertBro('F', 'G');
    tree.insertSon('E', 'K');
    cout << "initial complete\n\n";

    auto res = tree.preOrder();
    cout << "preOrder:\n";
    for(auto i : res){
        cout << i <<" ";
    }
    cout << endl << "inOrder:\n";
    res = tree.inOrder();
    for(auto i : res){
        cout << i <<" ";
    }
    cout << endl << "postOrder:\n";
    res = tree.postOrder();
    for(auto i : res){
        cout << i <<" ";
    }
    cout << endl << "delete the subtree \'C\'\n";
    tree.deleteNode('C');
    res = tree.preOrder();
    for(auto i : res){
        cout << i <<" ";
    }
    cout << endl;
    tree.deleteNode('A');
    tree.insertSon(0,'Z');
}