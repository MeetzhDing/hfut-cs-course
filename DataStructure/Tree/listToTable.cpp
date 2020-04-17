//程序将二叉链表存储的二叉树转换为顺序存储形式
//程序还完成 非递归输出二叉树先序序列最后一个节点的值
//由于树的插入操作十分繁琐，因为没有进行实现
#include <iostream>
using namespace std;
template<class T>
struct BNode{
    T data = T(0);
    BNode* firstSon = nullptr;
    BNode* nextBro = nullptr;
};

template <class T>
class Tree{
public:
    typedef BNode<T> node;
    Tree(){
        root = new node;
    }
    void setRoot(node* root){
        deleteTree(this->root);
        this->root = root;
    }

    //将二叉链表存储的二叉树转换为顺序存储形式
    void convertToSequence(char* seq){
        toSequence(1, root, seq);
    }

    T preOrderLastNode(){
        node* p = this->root;
        while(p->firstSon || p->nextBro){
            if(!p->nextBro)
                p = p->firstSon;
            else
                p = p->nextBro;
        }
        cout << p->data << endl;
    }
private:
    node* root;

    int toSequence(int loc,node* r,char* seq){
        seq[loc] = r->data;
        if(r->firstSon) toSequence(loc*2,r->firstSon,seq);
        if(r->nextBro) toSequence(loc*2+1,r->nextBro,seq);
    }

    void visit(node *r){
        cout << r->data << ' ';
    }
    void preOrder(node *r){
        if(r != nullptr) {
            visit(r);
            preOrder(r->firstSon);
            preOrder(r->nextBro);
        }
    }
    void inOrder(node *r){
        if(r != nullptr) {
            inOrder(r->firstSon);
            visit(r);
            inOrder(r->nextBro);
        }
    }
    void postOrder(node *r){
        if(r != nullptr) {
            postOrder(r->firstSon);
            postOrder(r->nextBro);
            visit(r);
        }
    }

    void deleteTree(node* r){
        if(r == nullptr) return;
        delete(r->firstSon);
        delete(r->nextBro);
        delete r;
    }
};

//构建初始化的树结构，非重点，请忽略
void buildTree(BNode<char>* root){
    root->data = 'A';
    root->firstSon = new BNode<char>;
    root->firstSon->data = 'B';
    root->nextBro = new BNode<char>;
    root->nextBro->data = 'C';
    root->firstSon->firstSon = new BNode<char>;
    root->firstSon->firstSon->data = 'D';
    root->firstSon->nextBro = new BNode<char>;
    root->firstSon->nextBro->data = 'E';
    root->nextBro->firstSon = new BNode<char>;
    root->nextBro->firstSon->data = 'F';
    root->nextBro->nextBro = new BNode<char>;
    root->nextBro->nextBro->data = 'G';
    root->firstSon->firstSon->firstSon = new BNode<char>;
    root->firstSon->firstSon->firstSon->data = 'H';
    root->firstSon->nextBro->firstSon = new BNode<char>;
    root->firstSon->nextBro->firstSon->data = 'I';
    root->nextBro->firstSon->firstSon = new BNode<char>;
    root->nextBro->firstSon->firstSon->data = 'J';
    root->nextBro->firstSon->nextBro = new BNode<char>;
    root->nextBro->firstSon->nextBro->data = 'K';
}

int main() {
    Tree<char> tree;
    auto root = new BNode<char>;
    buildTree(root);
    tree.setRoot(root);
    const int count = 15;
    char seq[count];
    for (auto &i : seq) {
        i = '^';
    }

    tree.convertToSequence(seq);
    for(int i=0;i<count; ++i){
        cout << i << '\t';
    }
    cout << endl;
    for(auto &i : seq){
        cout << i << '\t';
    }

    cout << endl << "先序遍历的最后一个节点的值是 ";
    tree.preOrderLastNode();
}