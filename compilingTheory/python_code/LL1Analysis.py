import sys
from inspect import stack
from PyQt5.QtWidgets import (QWidget, QLineEdit, QApplication, QTableWidget, QTableWidgetItem, QPushButton,
                             QHeaderView)


class LL1Analysis:
    def __init__(self, gram, start='S'):
        self.pub_tmp_set = set()  # 公共临时集合
        self.Gram = gram
        self.start = start
        self.Vn = set()
        self.Vt = set()
        for key,val in gram.items():  # 从输入语法中提取Vn
            self.Vn.add(key)
            for v in val:
                if v not in self.Gram:
                    self.Vt.add(v)
        self.Vt.discard('|')  # 从输入语法中提取Vt
        self.First = {}
        self.Follow = {k: set() for k in self.Vn}
        self.Follow[start].add('#')
        self.Mat = {}
        self.first()
        self.follow()
        self.bind_mat()
        self.message = []

    def get_str_first(self, s):  # 获得某子句的first集
        substr = s.split('|')
        for s in substr:
            if s[0] in self.Vt:
                self.pub_tmp_set.add(s[0])
            else:
                self.get_str_first(self.Gram[s[0]])  # 首字符为Vn递归调用自己

    def first(self):  # 获得所有Vn的first集
        for k in self.Vn:
            self.pub_tmp_set = set()
            self.get_str_first(self.Gram[k])
            self.First[k] = self.pub_tmp_set.copy()

    def follow(self):  # 获得所有Vn的follow集
        new_follow = 1  # 记录所有Vn符的follow集合元素个数之和
        old_follow = 0  # 当一次循环后个数和不变，说明follow完成
        while old_follow != new_follow:
            old_follow = new_follow
            for k in self.Vn:
                self.pub_tmp_set = set()  # 任意Vn，当在某一gram中出现
                for p in self.Gram.items():
                    for tmp in p[1].split('|'):
                        loc = tmp.find(k)
                        while -1 < loc < len(tmp):
                            if loc + 1 < len(tmp):  # 如果此Vn不出现在句尾
                                c = tmp[loc + 1]
                                if c in self.Vt:  # 则将Vn后一个Vt加入follow
                                    self.pub_tmp_set.add(c)
                                    break
                                for n in self.First[c]:  # 或后一个Vn的first全部元素加入follow中
                                    self.pub_tmp_set.add(n)
                                if 'ε' in self.First[c]:  # 若后一个Vn中有ε，继续检查后一个位置
                                    loc += 1
                                    continue
                            else:  # 如果出现在句尾，则将此gram的Vn的follow集合加入Vn的follow中
                                for n in self.Follow[p[0]]:
                                    self.pub_tmp_set.add(n)
                                break
                self.pub_tmp_set.discard('ε')  # 对某Vn，完成所有gram的检查，将tmp_set中的内容保存
                self.Follow[k] = self.pub_tmp_set.copy() | self.Follow[k]
            new_follow = 0
            for x in self.Follow:
                new_follow += len(x)

    def bind_mat(self):  # 求状态转移矩阵
        tmp_vt = self.Vt.copy()
        tmp_vt.add('#')
        tmp_vt.discard('ε')
        self.Mat = {k: {i: '' for i in tmp_vt} for k in self.Vn}  # 建立矩阵空间
        for vn in self.Vn:
            substr = self.Gram[vn].split('|')
            for s in substr:
                for a in tmp_vt:
                    self.pub_tmp_set = set()
                    self.get_str_first(s)
                    if a in self.pub_tmp_set:  # 为Vt，直接填入M[vn,a]
                        self.Mat[vn][a] = s
                    if 'ε' in self.pub_tmp_set:  # ε属于first(a), 任何b属于follow(vn), 有M[vn,a]= a
                        for b in self.Follow[vn]:
                            self.Mat[vn][b] = s

    def error(self, st, left, a, index):  # 发生错误时，error处理保存在message中
        msg = ''
        for ch in st:
            msg += ch
        X = st[-1]
        if X in self.Vn:
            self.message.append([msg, left, '{}->{}'.format(X, self.Gram[X]), 'error index{}:\'{}\''.format(index, a)])
        else:
            self.message.append([msg, left, '{} not belong to Vn'.format(X), 'error index{}:\'{}\''.format(index, a)])

    def record(self, st, left, x='', string=''):  # 处理的每一步骤记录到message中
        msg = ''
        for ch in st:
            msg += ch
        if x == '':
            b = ''
            c = 'get next'
        else:
            b = '{}->{}'.format(x, string)
            c = 'pop,push({})'.format(string)
        self.message.append([msg, left, b, c])

    def analysis(self, s):  # 总控程序
        s = s + '#'
        index = 0
        a = s[index]
        st = stack()
        st.clear()
        st.append('#')
        st.append(self.start)
        self.record(st, s[index:])
        X = st.pop()

        while not X == a == '#':
            if X in self.Vn:
                string = self.Mat[X][a]  # 对Vn，无错误则转化为Vt并压栈
                if string == '':
                    st.append(X)
                    self.error(st, s[index:], a, index + 1)
                    return self.message
                for c in reversed(string):
                    if c != 'ε':
                        st.append(c)
                self.record(st, s[index:], X, string)
            else:
                if a in self.Vt:  # 对Vt，无错误则从栈中弹出
                    if X != a:
                        st.append(X)
                        self.error(st, s[index:], a, index + 1)
                        return self.message
                    index += 1
                    a = s[index]
                    self.record(st, s[index:])
            X = st.pop()
        return self.message

    def res(self):
        vn, vt = [], []
        for x in self.Vn:
            vn.append(x)
        for x in self.Vt:
            vt.append(x)
        vn.sort()
        vt.sort()
        return [vn, vt, self.First, self.Follow, self.Mat]

    def test(self):
        print(self.Vn, self.Vt)
        print(self.First)
        print(self.Follow)
        print(self.Mat)


class GuiWidget(QWidget):  # gui程序内容，相应按键，显示输出
    def __init__(self, name):
        super().__init__()
        self.qle = QLineEdit(self)
        self.qle.setText('i+i*i')
        self.qle.move(100, 20)
        self.qbt = QPushButton(self)
        self.qbt.setText('确认')
        self.qbt.move(250, 20)
        self.qtw_result = QTableWidget(25, 4, self)
        header = ['分析栈', '剩余输入串', '所用产生式', '动作']
        self.qtw_result.setHorizontalHeaderLabels(header)
        self.qtw_result.setEditTriggers(QTableWidget.NoEditTriggers)
        self.qtw_result.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.qtw_result.verticalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.qtw_result.resize(450, 600)
        self.qtw_result.move(0, 50)

        self.qtw1 = QTableWidget(5, 8, self)
        self.qtw1.setEditTriggers(QTableWidget.NoEditTriggers)
        self.qtw1.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.qtw1.verticalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.qtw1.move(450, 100)
        self.qtw2 = QTableWidget(5, 8, self)
        self.qtw2.setEditTriggers(QTableWidget.NoEditTriggers)
        self.qtw2.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.qtw2.verticalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.qtw2.move(720, 100)
        self.qtw3 = QTableWidget(5, 8, self)
        self.qtw3.resize(500, 300)
        self.qtw3.setEditTriggers(QTableWidget.NoEditTriggers)
        self.qtw3.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.qtw3.verticalHeader().setSectionResizeMode(QHeaderView.Stretch)
        self.qtw3.move(450, 350)

        # self.setGeometry(300, 300, 800, 800)
        self.qbt.clicked.connect(self.onInputChanged)
        self.setWindowTitle(name)
        self.show()

    def onInputChanged(self):
        text = self.qle.text()
        if text == '':
            return
        gram = {'E': 'TG', 'G': '+TG|-TG|ε', 'T': 'FS', 'S': '*FS|/FS|ε', 'F': '(E)|i'}
        LL1 = LL1Analysis(gram, 'E')
        msg = LL1.analysis(text)
        res = LL1.res()
        row = -1
        for num in msg:
            row += 1
            col = -1
            for item in num:
                col += 1
                self.qtw_result.setItem(row, col, QTableWidgetItem(item))

        self.qtw1.setVerticalHeaderLabels(res[0])
        self.qtw2.setVerticalHeaderLabels(res[0])
        self.qtw3.setVerticalHeaderLabels(res[0])
        vtt = res[1]
        vtt.append('#')
        vtt.remove('ε')
        vtt.sort()
        self.qtw1.setHorizontalHeaderLabels(res[1])
        self.qtw2.setHorizontalHeaderLabels(vtt)
        self.qtw3.setHorizontalHeaderLabels(vtt)
        row = -1
        for x in res[0]:
            row += 1
            col = -1
            for y in res[1]:
                col += 1
                if y in (res[2])[x]:
                    self.qtw1.setItem(row, col, QTableWidgetItem('1'))
            col = -1
            for y in vtt:
                col += 1
                if y in (res[3])[x]:
                    self.qtw2.setItem(row, col, QTableWidgetItem('1'))
                if res[4][x][y] != '':
                    self.qtw3.setItem(row, col, QTableWidgetItem(x + '->' + res[4][x][y]))


def main():
    name = 'LL1Analysis'
    app = QApplication(sys.argv)
    ex = GuiWidget(name)
    sys.exit(app.exec_())

    # gram = {'E': 'TG', 'G': '+TG|-TG|ε', 'T': 'FS', 'S': '*FS|/FS|ε', 'F': '(E)|i'}
    # LL1 = LL1Analysis(gram, 'E')
    # LL1.test()
    # msg = LL1.analysis('i+i*i')
    # print(msg)


if __name__ == '__main__':
    sys.exit(main())
