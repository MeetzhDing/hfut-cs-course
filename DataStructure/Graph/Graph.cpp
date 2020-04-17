// 图的邻接表构建
#include <iostream>
#include <map>
#include <list>
#include <queue>
#include <vector>
#include <algorithm>

using namespace std;

template <class T>
class Graph{
public:
    explicit Graph(vector<T> data){
        sort(data.begin(),data.end());
        for(T i: data){
            this->graph[i] = list<T>();
        }
    }

    bool insertArc(T v, T u){
        if(v == u || !graph.count(v) || !graph.count(u)){
            return false;
        }
        list<T>& nodeV = graph[v];
        list<T>& nodeU = graph[u];
        if(find(nodeV.begin(), nodeV.end(), u) == nodeV.end()){
            nodeV.push_back(u);
            nodeU.push_back(v);
        }
        return true;
    }

    vector<T> travelDFS(){
        msg.clear();
        for(auto i:graph){
            visited[i.first] = false;
        }
        for(auto i:graph){
            if(!visited[i.first])
                dfs(i.first);
        }
        return this->msg;
    }

    vector<T> travelBFS(){
        msg.clear();
        for(auto i:graph){
            visited[i.first] = false;
        }
        for(auto i:graph){
            if(!visited[i.first])
                bfs(i.first);
        }
        return this->msg;
    }

    void show() const {
        for(auto pair: graph){
            cout << pair.first << ":\t";
            for(auto i: pair.second){
                cout << i << ' ';
            }
            cout << endl;
        }
    }

private:
    map<T,list<T>> graph;
    vector<T> msg;
    map<T,bool> visited;
    void dfs(T v){
        visit(v);
        visited[v] = true;
        for(auto u: graph[v]){
            if(!visited[u])
                dfs(u);
        }
    }

    void bfs(T v){
        queue<T> Q;
        Q.push(v);
        while(!Q.empty()){
            v = Q.front();
            Q.pop();
            if(!visited[v]) {
                visit(v);
                visited[v] = true;
            }
            for(auto i:graph[v]){
                if(!visited[i])
                    Q.push(i);
            }
        }
    }

    void visit(T t){
        msg.push_back(t);
    }
};


int main(){
    int size = 10;
    vector<int> nodes;
    for(int i=1;i<=size; i++){
        nodes.push_back(i);
    }
    Graph<int> graph(nodes);
    graph.insertArc(1,2);
    graph.insertArc(1,8);
    graph.insertArc(2,3);
    graph.insertArc(2,4);
    graph.insertArc(4,5);
    graph.insertArc(4,6);
    graph.insertArc(4,7);
    graph.insertArc(5,6);
    graph.insertArc(6,7);
    graph.insertArc(8,9);
    graph.insertArc(8,10);
    graph.insertArc(9,10);
    graph.show();
    cout << endl;
    for(auto i:graph.travelDFS()){
        cout << i << " ";
    }
    cout << endl;
    for(auto i:graph.travelBFS()){
        cout << i << " ";
    }
    cout << endl;
}