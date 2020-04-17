class LL1Analysis {
    constructor(gram, start) {
        this.pubset = new Set();
        this.start = start;
        this.gram = LL1Analysis.leftRecursion(gram);
        this.Vn = new Set();
        this.Vt = new Set();
        for (let k of gram.keys()) {
            this.Vn.add(k);
            let str = gram.get(k);
            for (let x = 0; x < str.length; x++) {
                if (!gram.has(str.charAt(x)))
                    this.Vt.add(str.charAt(x));
            }
        }
        this.Vt.delete('|');
        this.First = new Map();
        this.Follow = new Map();
        for (let p of this.Vn) {
            this.Follow.set(p, new Set());
        }
        this.Follow.get(start).add('#');
        this.Mat = new Map();
        this.first();
        this.follow();
        this.bind_mat();
        this.message = new Set();
    }
    test() {
        return [this.Vn, this.Vt, this.First, this.Follow, this.Mat];
    }

    static leftRecursion(gram) {
        let c = 'Z';
        for(let [key,val] of gram){
            let values = val.split('|');
            for(let x of values){
                if(x.charAt(0)===key){
                    let index = values.indexOf(x);
                    values = values.splice(0,index).concat(values.splice(index+1,values.length));
                    let newone = '';
                    let v = values[0];
                    gram.set(key,v+c);
                    gram.set(c,x.slice(1,val.length)+'|ε');
                    break;
                }
            }
        }
        return gram;
    }

    first() {
        for (let k of this.Vn) {
            this.pubset = new Set();
            this.get_str_first(this.gram.get(k));
            this.First.set(k, new Set(this.pubset));
        }
    }
    get_str_first(str) {
        let substr = str.split('|');
        for (let s of substr) {
            if (this.Vt.has(s.charAt(0)))
                this.pubset.add(s.charAt(0));
            else
                this.get_str_first(this.gram.get(s.charAt(0)));
        }
    }
    follow() {
        let new_follow = 1;
        let old_follow = 0;
        while (old_follow !== new_follow) {
            old_follow = new_follow;
            for (let k of this.Vn) {
                this.pubset = new Set();
                for (let [key, val] of this.gram.entries()) {
                    for (let tmp of val.split('|')) {
                        let loc = tmp.indexOf(k);
                        while (loc >= 0 && loc < tmp.length) {
                            if (loc + 1 < tmp.length) {
                                let c = tmp.charAt(loc + 1);
                                if (this.Vt.has(c)) {
                                    this.pubset.add(c);
                                    break;
                                }
                                for (let n of this.First.get(c))
                                    this.pubset.add(n);
                                if (this.First.get(c).has('ε')) {
                                    loc += 1;
                                }
                            }
                            else {
                                for (let n of this.Follow.get(key))
                                    this.pubset.add(n);
                                break;
                            }
                        }
                    }
                }
                this.pubset.delete('ε');
                this.Follow.set(k, new Set([...this.pubset, ...this.Follow.get(k)]));
            }
            new_follow = 0;
            for (let x of this.Follow)
                new_follow += x.length;
        }
    }
    bind_mat() {
        let tmp_vt = new Set(this.Vt);
        tmp_vt.add('#');
        tmp_vt.delete('ε');
        let tmpmap = new Map();
        for (let p of this.Vn) {
            tmpmap.clear();
            for (let q of tmp_vt) {
                tmpmap.set(q, '');
            }
            this.Mat.set(p, new Map(tmpmap));
        }
        for (let vn of this.Vn) {
            let subst = this.gram.get(vn).split('|');
            for (let s of subst)
                for (let a of tmp_vt) {
                    this.pubset = new Set();
                    this.get_str_first(s);
                    if (this.pubset.has(a))
                        this.Mat.get(vn).set(a, s);
                    if (this.pubset.has('ε'))
                        for (let b of this.Follow.get(vn))
                            this.Mat.get(vn).set(b, s);
                }
        }
    }
    error(st, left, a, index) {
        let msg = '';
        for (let ch of st)
            msg += ch;
        let X = st[st.length - 1];
        if (this.Vn.has(X))
            this.message.add([msg, left, `${X}->${this.gram.get(X)}`, `error index ${index}:${a}`]);
        else
            this.message.add([msg, left, `${X} not belong to Vn`, `error index ${index}:${a}`]);
    }
    record(st, left, x, string) {
        let b, c;
        let msg = '';
        for (let ch of st)
            msg += ch;
        if (x === '') {
            b = '';
            c = 'get next';
        }
        else {
            b = `${x}->${string}`;
            c = `pop,push(${string})`;
        }
        this.message.add([msg, left, b, c]);
    }
    analysis(s) {
        s = s + '#';
        let index = 0;
        let a = s.charAt(index);
        let st = [];
        st.length = 0;
        st.push('#');
        st.push(this.start);
        this.record(st, s.slice(index, s.length), '', '');
        let X = st.pop();
        while (!(X === '#' && a === '#' && X === a)) {
            if (this.Vn.has(X)) {
                let strr = this.Mat.get(X).get(a);
                if (strr === '') {
                    st.push(X);
                    this.error(st, s.slice(index, s.length), a, index + 1);
                    return this.message;
                }
                for (let c of strr.split('').reverse().join('')) {
                    if (c !== 'ε')
                        st.push(c);
                }
                this.record(st, s.slice(index, s.length), X, strr);
            }
            else {
                if (this.Vt.has(a)) {
                    if (X !== a) {
                        st.push(X);
                        this.error(st, s.slice(index, s.length), a, index + 1);
                        return this.message;
                    }
                    index += 1;
                    a = s.charAt(index);
                    this.record(st, s.slice(index, s.length), '', '');
                }
            }
            X = st.pop();
        }
        return this.message;
    }
}

exports = module.exports = LL1Analysis;

let gram = new Map([
    ['E', 'TG'],
    ['G', '+TG|-TG|ε'],
    ['T', 'FS'],
    ['S', '*FS|/FS|ε'],
    ['F', '(E)|i']
]);

let newone = new Map([      //简单的一个左递归转化
    ['E','E+T|T'],
    ['T','i']
]);

if (require.main === module) {
    let ll1 = new LL1Analysis(gram, 'E');
    console.log(ll1.analysis('i+i*i'));
    console.log(ll1.test());
}
