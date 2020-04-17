const _ = require('lodash');

class LR1Analysis {
    constructor(gram, start) {
        this.pubset = new Set();   //程序公共集合，用于传递数据
        this.start = start;         //设定文法开始符号
        this.gram = ['S:'+start].concat(Array.from(gram));  // 拓广文法
        this.production = new Set();    //所有形如E: .T的新产生式集合
        for(let item of gram){
            this.production.add(item.slice(0,2) + '.'+ item.slice(2,item.length));
        }
        this.Vn = new Set();
        this.Vt = new Set();
        for (let k of this.production) {
            this.Vn.add(k[0]);
        }       //识别所有的非终结符Vn
        for (let k of this.production) {
            for (let x = 3; x < k.length; x++) {
                if (!this.Vn.has(k.charAt(x)))
                    this.Vt.add(k.charAt(x));
            }
        }       //识别所有的终结符Vt
        this.states = new Map();
        this.initState('S:.'+ start);//初始化所有状态
        this.Action = [];
        this.GOTO = [];
        this.createTable(); //根据状态内容建立分析表
        // this.test();
    }

    initState(str) {
        let state = new Map();
        state.set(str, new Set('#'));//设置首个产生式的展望符号为 #
        state = this.CLOSURE(state); //构建初始状态的闭包
        this.states.set(this.states.size, state);	//将首个状态记录到状态集中
        for (let [,i] of this.states) {			//对于状态集合中的每一个状态 i
            for (let x of this.Vn) {			//枚举每一个Vn
                let newState = this.GO(i, x);   //如果GO得到的状态不在状态集中，则加入
                if (newState.size !== 0 && this.findState(newState)===-1)
                    this.states.set(this.states.size, newState);
            }
            for (let x of this.Vt) {			//对于状态集合中的每一个状态 i
                let newState = this.GO(i, x);	//如果GO得到的状态不在状态集中，则加入
                if (newState.size !== 0 && this.findState(newState)===-1)
                    this.states.set(this.states.size, newState);
            }
        }
    }

    findState(newstate) {		//用于检测一个状态是否 已在状态集合之中
        for (let [num, state] of this.states) {		//遍历状态集合进行比对
            if (state.size === newstate.size) {
                let count = 0;
                for (let [str, future] of newstate)//使用了lodash来进行相同判定
                    if (state.has(str) && _.isEqual(state.get(str), future))
                        count += 1;
                if (count === newstate.size)
                    return num;
            }
        }
        return -1;
    }

    get_str_first(str) {	//在获得一个产生式对应的展望符时，需要用到求first集
        let c = str.charAt(0);
        if (c === 'ε' && str.size > 1)	//如果字符首集包含 ε，则求后一个first集合
            this.get_str_first(str.slice(1, str.length));
        if (!this.Vn.has(c))
            this.pubset.add(c);			//如果不是Vn，则加入到first中
        else {
            for (let k of this.production.keys()) {
                if (k.charAt(0) === c && k.charAt(3) !== c) {
                    this.get_str_first(k.slice(3, k.length));
                }
            }
        }
    }

    CLOSURE(state) {		//输入参数为一个状态
        for (let [key, val] of state) {	//对于状态中每一个
            let index = key.indexOf('.') + 1;
            if (index === key.length)	//如果状态不再接受任何符
                continue;
            let c = key.charAt(index);	//对于产生式.后面的所有符号
            if (this.Vn.has(c)) {	//如果符号是Vn，加入此Vn开头的产生式
                let beta = '';
                if (index + 1 < key.length)
                    beta = key.slice(index + 1, key.length);
                if (beta.indexOf('ε') === -1 && beta.length !== 0) {
                    this.pubset = new Set(val);//如果产生式中无ε且长度不是0
                    this.get_str_first(beta);  //求其first集合，作为展望符
                    for (let str of this.production) {
                        if (str.charAt(0) === c)
                            state.set(str, new Set(this.pubset))
                    }
                } else {
                    this.pubset = new Set(val);
                    for (let a of val) {	//如果含有ε或者长度为0
                        this.get_str_first(beta + a);//获得first集合
                    }
                    for (let str of this.production) {	//作为展望符
                        if (str.charAt(0) === c)
                            state.set(str, new Set(this.pubset))
                    }
                }
            }
        }
        return state;	//返回得到的闭包状态
    }

    GO(I, X){//接受两个参数，状态I, 符号X，返回得到的新状态
        let state = new Map();
        for (let [key, val] of I) {		//对于状态I中的每一个产生式
            let index = key.indexOf('.');
            if (index + 1 < key.length) {
                let c = key.charAt(index + 1);
                if (c === X) {//如果产生式中.之后的符号是X，新状态中加入新语句
                    let str = key.slice(0, index) + X + '.';
                    if (index + 2 <= key.length)
                        str += key.slice(index + 2, key.length);
                    state.set(str, val); //新状态中加入产生式，继承其展望符
                }
            }
        }
        state = this.CLOSURE(state);	//对新状态求他的闭包
        return state;
    }

    createTable() {		//根据LR1类中预先得到的内容，构造状态转移表
        let vt = new Set(this.Vt);
        vt.delete('ε');
        vt.add('#');		//此处的vt为构造表中的表头，含有#，不含有ε
        for(let num = 0; num < this.states.size; num+=1){
            this.Action[num] = new Map();	//给Action初始化为''
            for(let c of vt){
                this.Action[num].set(c,'');
            }
            this.GOTO[num] = new Map();		//给GOTO表初始化为''
            for(let c of this.Vn){
                this.GOTO[num].set(c,'');
            }
        }
        for(let [num,state] of this.states){//对于状态集合中的每一个状态
            for(let [str,future] of state){
                let index = str.indexOf('.');
                if(index+1===str.length)		//给Action中的项设定为 r+产生式序号，归约
                    for(let fu of future)
                        this.Action[num].set(fu,'r'+ this.gram.indexOf(str.slice(0,index)));
                else {
                    let c = str.charAt(index+1);
                    let goResult = this.GO(state,c);
                    if(this.Vn.has(c))	//给GOTO中的项设定为 转移的状态号，转移
                        this.GOTO[num].set(c,this.findState(goResult));
                    else			//给Action中的项设定为 s+新状态序号，移进
                        this.Action[num].set(c,'s'+this.findState(goResult));
                }
            }
            if(state.has('S:'+this.start+'.'))	//在Action表的合适位置加入acc
                this.Action[num].set('#','acc');
        }
    }

    analysis(str){	//接受一个输入串，用于构造message，最终传递给外部显示
        let str_left = str;
        let stStack = [];	//状态栈
        let symStack = [];	//符号栈
        stStack.push('0');	//初始状态为0
        symStack.push('#');	//初始接受符号为#
        let No = 0;
        let Message = [];
        while(str_left!=='#' || symStack.size!==2 || 	//当未完成分析时继续循环
        symStack.charAt(symStack.length-1)!==this.start){
            No += 1;
            let c = str_left.charAt(0);
            let state = stStack[stStack.length-1];
            let op = this.Action[state].get(c);
            // if(op==='') Error;
            if(op.charAt(0)==='s'){	//当表中内容以s 开头时，移入并转移状态，记录信息
                let msg = [No, stStack, symStack, str_left,
                    `Action[${state},${c}]=${op},状态${op.charAt(1)}入栈`];
                Message.push(msg);
                stStack.push(op.charAt(1));
                symStack.push(c);
                str_left = str_left.slice(1,str_left.length);
            }
            if(op.charAt(0)==='r'){ //当表中内容以r 开头时，归约并转移状态，记录信息
                let production = this.gram[op.charAt(1)];
                let back = production.length -2;
                let rawState =stStack[stStack.length-1-back];
                let vn = production.charAt(0);
                let newState = this.GOTO[rawState].get(vn);
                let msg = [No, stStack, symStack, str_left,
                    `${op}:${production},规约,GOTO(${rawState},${vn})=${newState}入栈`];
                Message.push(msg);
                stStack = stStack.slice(0,stStack.length-back);
                stStack.push(newState.toString());
                symStack = symStack.slice(0,symStack.length-back);
                symStack.push(vn);
            }
            if(op==='acc'){ //当表中内容以为Acc的时候，记录相关信息，并且结束分析过程
                let msg = [No, stStack, symStack, str_left,
                    `Acc:分析成功`];
                Message.push(msg);
                break;
            }
        }
        return Message;		//返回所有记录的内容，用于显示
    }

    test() {
        // console.log(this.states);
        return [this.Vn,this.Vt,this.states,this.Action,this.GOTO];
    }
}


exports = module.exports = LR1Analysis;

let gram = new Set([
    'E:E+T',
    'E:T',
    'T:T*F',
    'T:F',
    'F:(E)',
    'F:i'
]);
let simpleGram = new Set([
    'E:BB',
    'B:aB',
    'B:b'
]);

let newone = new Set([
    'E:E+T',
    'E:T',
    'T:i'
]);

function leftre (gram) {
    let c = 'Z';	//指配的新的非终结符
    for(let x of gram){
        if(x.charAt(0)===x.charAt(2)){
            gram.delete(x);
            let newone = x.slice(0,2);	//分割原产生式
            for(let t of gram){
                if(t.charAt(0)===x.charAt(0)){
                    newone += t.slice(2,t.length);
                    newone += c;
                    gram.add(newone);	//添加新产生式
                    gram.delete(t);
                    gram.add( c + ':' +x.slice(3,x.length));
                    gram.add(c+ ':ε');	//添加包含ε的产生式
                    c -= 1;
                    break;
                }
            }
        }
    }
    return gram;	//返回不含直接左递归的文法
}

if (require.main === module) {
    let lr1 = new LR1Analysis(simpleGram, 'E');
    console.log(lr1.analysis('abb#'));
    console.log(lr1.test());
}