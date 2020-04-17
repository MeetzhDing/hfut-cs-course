#include <iostream>
#include <random>
using namespace std;

template <class T>
class queue
{
public:
    enum error_code { success, underflow, overflow };
    queue() {
        front = 0;
        rear = 0;
        data = new int(SIZE);
    };
    bool empty()const {
        return front == rear;
    }
    bool full()const {
        return (rear + 1) % SIZE == front;
    }
    error_code get_front(T& x)const {
        if (empty()) return underflow;
        x = data[front];
        return success;
    }
    error_code append(T x) {
        if (full()) return overflow;
        data[rear] = x;
        rear = (rear + 1) % SIZE;
        return success;
    }
    error_code serve() {
        if (empty()) return underflow;
        front = (front + 1) % SIZE;
        return success;
    }
    int get_size()const {
        return (rear + SIZE) % SIZE - front;
    }

    ~queue() {
        delete[] data;
    };

private:
    const int SIZE = 100;
    T* data;
    int front, rear;
};


int main()
{
    queue<int> myqueue;
    int order = 1;
    for (int i = 0; i < 10; i++) {
        myqueue.append(order++);
    }
    cout << "为模拟环境，队伍中初始有10人。\n";
    default_random_engine e;
    uniform_int_distribution<unsigned> u(0, 1);
    for (int i = 0; i < 30; i++) {
        if(u(e) && !myqueue.empty()) {
            int temp;
            myqueue.get_front(temp);
            myqueue.serve();
            cout << "请" << temp << "号顾客办理业务，队伍中还有"<< myqueue.get_size() <<"人。\n";
        }
        if(u(e)) {
            myqueue.append(order++);
            cout << "队尾新增第" << order << "号，队伍中还有" << myqueue.get_size()<< "人。\n";
        }
    }
}

