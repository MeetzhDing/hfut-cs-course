const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const LL1Analysis = require('../LL1.js');
const LR1Analysis = require('../LR1.js');

router.get('/', function(req, res, next) {
    res.render('index', { title: '编译原理' });
});
router.get('/LL1', function(req, res, next) {
    res.render('./LL1/index', { title: 'LL1' });
});
router.get('/LR1', function(req, res, next) {
    res.render('./LR1/index', { title: 'LL1' });
});

router.post('/LL1', function (req, res) {
    let gram = new Map([
        ['E', 'TG'],
        ['G', '+TG|-TG|ε'],
        ['T', 'FS'],
        ['S', '*FS|/FS|ε'],
        ['F', '(E)|i']
    ]);
    if(req.body.str){
        let body = req.body;
        let str = body.str;
        let ll1 = new LL1Analysis(gram, 'E');
        let result = ll1.analysis(str);
        let [vn,vt,first,follow,mat] = ll1.test();
        ejs.renderFile('./views/LL1/result.ejs',{vn,vt,first,follow,mat,result},function (err,data) {
            if(err) {
                res.send('error');
            }else {
                res.send(data);
            }
        })
    }
});

router.post('/LR1', function (req, res) {
    let gram = new Set([
        'E:E+T',
        'E:T',
        'T:T*F',
        'T:F',
        'F:(E)',
        'F:i'
    ]);

    if(req.body.str){
        let body = req.body;
        let str = body.str;
        if(str.charAt(str.length-1)!=='#')
            str += '#';
        let lr1 = new LR1Analysis(gram, 'E');
        let result = lr1.analysis(str);
        let [vn,vt,states,Action,GoTo] = lr1.test();
        ejs.renderFile('./views/LR1/result.ejs',{result,vn,vt,states,Action,GoTo},function (err,data) {
            if(err) {
                res.send('error');
            }else {
                res.send(data);
            }
        })
    }
});

module.exports = router;
