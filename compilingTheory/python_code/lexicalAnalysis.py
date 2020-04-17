# lexicalAnalysis:
# if(n=0)
#     n = n+1;
# a<= 3b%);
import sys


class Lexical:
    def __init__(self):  # 初始化关键字，分隔符，运算符，关系符等
        self.kList = ['asm', 'auto', 'break', 'default', 'do', 'double', 'for', 'if', 'long', 'main', 'printf',
                      'public', 'return', 'scanf', 'short', 'static', 'typedef', 'using', 'void', 'while']
        self.sList = [',', ';', '(', ')', '[', ']', '{', '}']
        self.mList = ['+', '-', '*', '/']
        self.rList = ['!=', '<', '<=', '=', '==', '>', '>=']
        self.idList = []
        self.ciList = []
        self.line = ''  # 以下变量为词法分析类中公共使用
        self.row = 0
        self.col = 0
        self.message = []  # 保存所有词的状态，传递给外部函数

    def analysis(self, filename):
        for _line in open(filename, 'r'):  # 文本中每行进行分析
            self.row += 1
            self.col = 0
            self.line = _line
            line_length = len(self.line)
            while self.col < line_length:
                ch = self.getchar()
                if ch == ' ' or ch == '\t' or ch == '\n':  # 检测空格，tab， 或行结束
                    continue
                if self.in_s_list(ch) or self.in_m_list(ch) or self.in_r_list(ch):  # 检测 分隔符 运算符 关系符
                    continue
                elif self.is_digit(ch):  # 字符为数字，向后搜索提取整个数字串
                    self.get_num(ch)
                elif self.is_letter(ch):  # 字符为字母，向后搜索提取整个单词串
                    self.get_word(ch)
                else:
                    self.record(0, ch)  # 不符合以上情况，记录出错
        return self.message

    def getchar(self):
        if self.col < len(self.line):
            self.col += 1
            return self.line[self.col - 1]
        return '\n'

    def retract(self):
        if self.col > 0:
            self.col -= 1

    def is_digit(self, c):
        return '0' <= c <= '9' or c == '.'

    def is_letter(self, c):
        return 'a' <= c <= 'z' or 'A' <= c <= 'Z' or c == '_'

    def in_k_list(self, s):
        for i in range(len(self.kList)):
            if self.kList[i] == s:
                self.record(1, s)
                return i + 1
        return 0

    def in_s_list(self, c):
        for i in range(len(self.sList)):
            if self.sList[i] == c:
                self.record(2, c)
                return i + 1
        return 0

    def in_m_list(self, c):
        for i in range(len(self.mList)):
            if self.mList[i] == c:
                self.record(3, c)
                return i + 1
        return 0

    def in_r_list(self, c):
        if c in self.rList or c == '!':
            if self.getchar() != '=':
                self.retract()
            else:
                c += '='
            self.record(c == '!' if 0 else 4, c)
            for i in range(len(self.rList)):
                if self.rList[i] == c:
                    return i + 1
        return 0

    def get_word(self, char):  # 词首为字母或下划线时，提取整个串，检验标识符合法性并记录
        tempToken = char
        ch = self.getchar()
        while self.is_letter(ch) or self.is_digit(ch):
            tempToken += ch
            ch = self.getchar()
        self.retract()
        if not self.in_k_list(tempToken):
            self.deal_word(tempToken)

    def get_num(self, char):  # 词首为数字时，提取整个串，检验是否为数字并记录
        tempToken = char
        ch = self.getchar()
        while self.is_digit(ch) or self.is_letter(ch):
            tempToken += ch
            ch = self.getchar()
        self.retract()
        index = tempToken.find('.')
        if index == -1 and tempToken.isdigit():
            self.deal_num(tempToken)
        elif tempToken[:index].isdigit() and tempToken[index + 1:].isdigit():
            self.deal_num(tempToken)
        else:
            self.record(0, tempToken)

    def deal_word(self, s):  # 提取出标识符后，记录到标识符表
        self.record(6, s)
        for i in range(len(self.idList)):
            if self.idList[i] == s:
                return i + 1
        self.idList.append(s)
        return len(self.idList) + 1

    def deal_num(self, s):  # 提取出数字串后，记录到常数表
        self.record(5, s)
        for i in range(len(self.ciList)):
            if self.ciList[i] == s:
                return i + 1
        self.ciList.append(s)
        return len(self.ciList) + 1

    def record(self, kind, word):  # 根据传入内容，记录单词属性，位置，保存到message中
        word_type = ['Error', '关键字', '分界符', '算数符', '关系符', '常数值', '标识符']
        if kind == 0:
            pair = word_type[kind]
            self.message.append([word, pair, word_type[kind], '({},{})'.format(self.row, self.col - len(word) + 1)])
        else:
            pair = '(' + str(kind) + ',' + word + ')'
            self.message.append([word, pair, word_type[kind], '({},{})'.format(self.row, self.col - len(word) + 1)])
        # if kind == 0:
        #     pair = word_type[kind]
        #     print('{0:10}{1:12}{2:13}({3},{4})'
        #           .format(word, pair, word_type[kind], self.row, self.col - len(word) + 1))
        # else:
        #     pair = '(' + str(kind) + ',' + word + ')'
        #     print('{0:10}{1:12}{2:10}({3},{4})'
        #           .format(word, pair, word_type[kind], self.row, self.col - len(word) + 1))


def main():
    lex = Lexical()
    print('{0:8}{1:9}{2:10}({3},{4})'
          .format('单词', '二元序列', '类型', '行', '列'))
    msg = lex.analysis('a.c')  # 获取message，并输出
    for x in msg:
        if x[2] == 'Error':
            print('{0:10}{1:12}{2:13}{3}'.format(x[0], x[1], x[2], x[3]))
        else:
            print('{0:10}{1:12}{2:10}{3}'.format(x[0], x[1], x[2], x[3]))
    sys.exit()


if __name__ == '__main__':
    sys.exit(main())
