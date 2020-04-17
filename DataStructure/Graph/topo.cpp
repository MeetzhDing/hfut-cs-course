#include <iostream>
#include <queue>
#include <list>
#include <map>

using namespace std;
class Graph {
public:
    explicit Graph(int V) {
        this->V = V;
        adj = new list<int>[V];
        inDegree = new int[V];          // 入度全部初始化为0
        for(int i=0; i<V; ++i)
            inDegree[i] = 0;
    }

    ~Graph() {
        delete [] adj;
        delete [] inDegree;
    }

    void addEdge(int v, int w) {
        adj[v].push_back(w);
        ++inDegree[w];
    }

    bool topological_sort() {
        for(int i=0; i<V; ++i)
            if(inDegree[i] == 0)
                Q.push(i);         // 将所有入度为0的顶点入队
        int count = 0;             // 计数，记录当前已经输出的顶点数
        while(!Q.empty()) {
            int v = Q.front();      // 从队列中取出一个顶点
            Q.pop();
            cout << v << " ";      // 输出该顶点
            count += 1;
            // 将所有v指向的顶点的入度减1，并将入度减为0的顶点入栈
            auto beg = adj[v].begin();
            for( ; beg!=adj[v].end(); ++beg)
                if(!(--inDegree[*beg]))
                    Q.push(*beg);       // 若入度为0，则入栈
        }
        return count >= V;             // 拓扑排序成功
    }

private:
    int V;             // 顶点个数
    list<int> *adj;    // 邻接表
    queue<int> Q;      // 维护一个入度为0的顶点的集合
    int* inDegree;     // 记录每个顶点的入度
};




int main(){
    Graph graph(10);
    graph.addEdge(0,1);
    graph.addEdge(0,2);
    graph.addEdge(0,3);
    graph.addEdge(1,4);
    graph.addEdge(2,4);
    graph.addEdge(2,5);
    graph.addEdge(3,5);
    graph.addEdge(4,6);
    graph.addEdge(4,7);
    graph.addEdge(5,7);
    graph.addEdge(5,8);
    graph.addEdge(6,9);
    graph.addEdge(7,9);
    graph.addEdge(8,9);
    if(graph.topological_sort())
        cout << "\n不是无环图或有多个连通分量\n";
}