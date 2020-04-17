// 二叉树
#include <iostream>
#include <list>
#include <vector>
#include <stack>

using namespace std;

template <class T>
struct BNode{
    T data = T();
    BNode* lChild= nullptr;
    BNode* rChild= nullptr;
};

template <class T>
class BinaryTree{
public:
    typedef BNode<T> node;
    explicit BinaryTree() = default;
    explicit BinaryTree(T rootData){
        this->setRoot(rootData);
    }

    bool setRoot(T rootData){
        if(this->root != nullptr)
            return false;
        this->root = new node;
        this->root->data = rootData;
        this->size += 1;
    }

    ~BinaryTree(){
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
            if(loc->lChild->data ==data) {
                deleteTree(loc->lChild);
                loc->lChild = nullptr;
            } else {
                deleteTree(loc->rChild);
                loc->rChild = nullptr;
            }
            return true;
        }
    }

    bool insertLeft(T pos, T data){
        node* loc = locate(pos);
        node* exist = locate(data);
        if(!loc || exist)
            return false;
        if(loc->lChild == nullptr){
            loc->lChild = new node;
            loc->lChild->data = data;
        } else{
            node* son = loc->lChild;
            while(son->rChild!= nullptr)
                son = son->rChild;
            son->rChild = new node;
            son->rChild->data = data;
        }
        this->size += 1;
        return true;
    }

    bool insertRight(T pos, T data){
        if(this->size==0 || locate(pos)== nullptr)
            return false;
        node* loc = locate(pos);
        if(loc->rChild== nullptr){
            loc->rChild = new node;
            loc->rChild->data = data;
        } else {
            auto n = new node;
            n->rChild = loc->rChild;
            n->data = data;
            loc->rChild = n;
        }
        this->size += 1;
        return true;
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

    node* locate(T data){
        return locate(data, this->root);
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
                p=p->lChild;
            }
            if(!s.empty())
            {
                p=s.top();
                s.pop();
                p=p->rChild;
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
                if(p->lChild != nullptr &&  p->lChild->data == data
                   || p->rChild != nullptr && p->rChild->data == data)
                    return p;
                s.push(p);
                p=p->lChild;
            }
            if(!s.empty())
            {
                p=s.top();
                s.pop();
                p=p->rChild;
            }
        }
    }

    void deleteTree(node* r){
        if(r == nullptr) return;
        deleteTree(r->lChild);
        deleteTree(r->rChild);
        delete r;
        this->size -= 1;
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
                p=p->lChild;
            }
            if(!s.empty())
            {
                p=s.top();
                s.pop();
                p=p->rChild;
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
                p=p->lChild;
            }
            if(!s.empty())
            {
                p=s.top();
                this->visit(p);
                s.pop();
                p=p->rChild;
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
            if((cur->lChild== nullptr && cur->rChild== nullptr)||
               (pre!= nullptr && (pre==cur->lChild||pre==cur->rChild)))
            {
                this->visit(cur);  //如果当前结点没有孩子结点或者孩子节点都已被访问过
                s.pop();
                pre=cur;
            } else {
                if(cur->rChild!= nullptr)
                    s.push(cur->rChild);
                if(cur->lChild!= nullptr)
                    s.push(cur->lChild);
            }
        }
    }
};

int main(){
    BinaryTree<char> bTree('A');
    bTree.insertLeft('A', 'B');
    bTree.insertRight('B', 'C');
    bTree.insertRight('C', 'D');
    bTree.insertLeft('C', 'H');
    bTree.insertRight('H', 'I');
    bTree.insertLeft('D', 'J');
    bTree.insertLeft('B', 'E');
    bTree.insertRight('E', 'F');
    bTree.insertRight('F', 'G');
    bTree.insertLeft('E', 'K');
    cout << "initial complete\n\n";

    auto res = bTree.preOrder();
    cout << "preOrder:\n";
    for(auto i : res){
        cout << i <<" ";
    }
    cout << endl << "inOrder:\n";
    res = bTree.inOrder();
    for(auto i : res){
        cout << i <<" ";
    }
    cout << endl << "postOrder:\n";
    res = bTree.postOrder();
    for(auto i : res){
        cout << i <<" ";
    }
    cout << endl << "delete the subtree \'C\'\n";
    bTree.deleteNode('C');
    res = bTree.preOrder();
    for(auto i : res){
        cout << i <<" ";
    }
    cout << endl;
    bTree.deleteNode('A');
    bTree.setRoot('Z');
}