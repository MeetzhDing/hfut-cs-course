// 线索二叉树 此处实现的是先根序线索二叉树 实现了线索二叉树的插入与删除功能
#include <iostream>
#include <list>
#include <vector>
#include <stack>

using namespace std;

template <class T>
struct BNode{
    T data = T();
    bool lTag= true, rTag = true; //新节点内的指针默认都是线索
    BNode* lChild= nullptr;
    BNode* rChild= nullptr;
};

template <class T>
class ThreadedBinTree{
public:
    typedef BNode<T> node;
    explicit ThreadedBinTree() = default;
    explicit ThreadedBinTree(T rootData){
        this->setRoot(rootData);
    }

    bool setRoot(T rootData){
        if(this->root != nullptr)
            return false;
        this->root = new node;
        this->root->data = rootData;
        this->size += 1;
        return true;
    }

    ~ThreadedBinTree(){
        deleteTree(this->root);
    }

    bool insertLeft(T pos, T data){
        node* loc = locate(pos);
        node* exist = locate(data);
        if(!loc || exist || !loc->lTag)
            return false;
        auto tmp = new node;
        tmp->data = data;
        tmp->lChild = loc;
        tmp->rChild = loc->rChild;
        if(tmp->rChild && tmp->rChild->lTag)
            tmp->rChild->lChild = tmp;
        if(loc->rTag)
            loc->rChild = tmp;
        loc->lChild = tmp;
        loc->lTag = false;
        this->size += 1;
        return true;
    }

    bool insertRight(T pos, T data){
        node* loc = locate(pos);
        node* exist = locate(data);
        if(!loc || exist || !loc->rTag)
            return false;
        auto tmp = new node;
        tmp->data = data;
        if(loc->lTag){
            tmp->lChild = loc;
        } else {
            auto pre = loc->lChild;
            while(!pre->rTag || !pre->lTag){
                if(!pre->rTag){
                    pre = pre->rChild;
                } else {
                    pre = pre->lChild;
                }
            }
            tmp->lChild = pre;
        }
        tmp->rChild = tmp->lChild->rChild;
        tmp->lChild->rChild = tmp;
        if(tmp->rChild && tmp->rChild->lTag)
            tmp->rChild->lChild = tmp;
        loc->rTag = false;
        this->size += 1;
        return true;
    }

    node* locate(T data){
        return locate(data, this->root);
    }

    vector<T> preOrder(){
        pubVec.clear();
        preOrder(root);
        return pubVec;
    }

    bool deleteNode(T data){
        auto preAndFather = locatePreFather(data, this->root);
        auto pre = preAndFather.first;
        auto father = preAndFather.second;
        if(!pre){
            deleteTree(this->root);
            this->root = nullptr;
            return true;
        }
        if(!father->lTag){
            father->rTag = true;
            father->rChild = father->lChild;
        }
        auto loc = presuc(pre);
        auto tmp = loc;
        while(!tmp->rTag || !tmp->lTag){
            if(!tmp->rTag){
                tmp = tmp->rChild;
            } else {
                tmp = tmp->lChild;
            }
        }
        auto next = tmp->rChild;
        if(next && next->lTag){
            next->lChild = pre;
        }
        if(pre->rTag){
            pre->rChild = next;
        }
        deleteTree(loc);
    }

private:
    node* root = nullptr;
    int size = 0;
    vector<T> pubVec;

    void visit(node *r){
        pubVec.push_back(r->data);
    }

    node* presuc(node* p) const {
        if (!p->lTag) return ( p->lChild );
        else return ( p -> rChild );
    }

    node* locate(T data, node* n) const {
        while ( n != nullptr )
        {	if(n->data == data)
                return n;
            n = presuc(n);
        }
    }

    pair<node*,node*> locatePreFather(T data, node *n) const {
        if(this->root->data == data){
            return make_pair((node*) nullptr, (node*) nullptr);
        }
        node* father=nullptr;
        node* pre= nullptr;
        while ( n != nullptr )
        {
            auto next = presuc(n);
            if(next && next->data == data){
                pre = n;
            }
            if(!n->lTag && n->lChild->data == data ||
               !n->rTag && n->rChild->data == data){
                father = n;
            }
            n = next;
        }
        return make_pair(pre,father);
    }

    void preOrder(node *r){
        while(r){
            visit(r);
            r = presuc(r);
        }
    }

    void deleteTree(node* r){
//        if(r->lTag && r->rTag) return;
        if(!r->lTag)
            deleteTree(r->lChild);
        if(!r->rTag)
            deleteTree(r->rChild);
        delete r;
        this->size -= 1;
    }


};

int main(){
    ThreadedBinTree<char> bTree('A');
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
    cout << endl << "delete the subtree \'C\'\n";
    bTree.deleteNode('C');
    res = bTree.preOrder();
    for(auto i : res){
        cout << i <<" ";
    }
    cout << endl;
    bTree.deleteNode('A');
    bTree.setRoot('Z');
    cout << endl;
}