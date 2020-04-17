#include <iostream>

template <typename T>
class stack{
public:
    stack(){
        count = 0;
    }
    bool empty() const {
        return count==0;
    }
    bool full() const {
        return count==MAX;
    }
    T get_top() const {
        if(empty()) throw "Stack is empty!";
        return data[count-1];
    }
    T push(const T x){
        if(full()) throw "Stack is full!";
        data[count] = x;
        count++;
    }
    T pop(){
        if(empty()) throw "Stack is empty, can't pop";
        count--;
        return data[count];
    }
private:
    static const int MAX = 20;
    unsigned int count;
    T data[MAX];
};

int priority (char op) {
    if (op == '(' || op == ')')
        return 1;
    if (op == '+' || op == '-')
        return 2;
    if (op == '*' || op == '/')
        return 3;
    if(op=='#') return -1;
    return 0;
}

double Compute (double left, double right, char op) {
    switch (op) {
        case '+':
            return left + right;
        case '-':
            return left - right;
        case '*':
            return left * right;
        case '/':
            return left / right;
        default:
            return 0;
    }
}

void calc(const std::string &equation) {
    stack<char> symbolStack;
    symbolStack.push('#');
    stack<double> numStack;
    int temp = 0;

    for(int i=0;i<equation.length();){
        int sign = i; 
        while ('0'<=equation[i] && equation[i]<='9') {  
            temp = temp*10 + equation[i]-'0';
            i++;        //循环从表达式中析取数字，如果是数字，就自增i
        }               
        if(i!=sign) {   //sign保留循环开始时的i值，发生变动证明析取到数字，push
            numStack.push(temp);
            temp = 0;
        } else{
            char op = equation[i];  //运行到此处说明是运算符或括号
            if(op=='('){
                symbolStack.push(op);   //遇到'('便直接进行压入
                i++;
                continue;
            }
            while(priority(op) <= priority(symbolStack.get_top())) {        
                if(op==')' && symbolStack.get_top()=='('){//根据运算符优先级处理内容
                    symbolStack.pop();
                    break;
                }
                double right = numStack.pop();
                numStack.push(Compute(numStack.pop(), right, symbolStack.pop()));
            }
            if(op!=')') symbolStack.push(op);   //遇到')',便弹出符号栈中的'('
            i++;
        }
    }
    while(symbolStack.get_top()!='#') {     //算式解析完成后,将栈中剩余内容全部处理
        double right = numStack.pop();
        numStack.push(Compute(numStack.pop(), right, symbolStack.pop()));
    }
    std::cout << equation + " = " << numStack.get_top() <<std::endl;
};

int main() {
    calc("(1+2)+((2+3)+3)");
    calc("2-(9/3)+2*3");
    calc("1+2*3/2-3");
    std::cout <<"自动演示完成\n";

    std::cout << "请输入算式: ";
    std::string equ;
    std::cin >> equ;
    calc(equ);
}