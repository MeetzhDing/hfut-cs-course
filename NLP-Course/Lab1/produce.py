# 根据词牌名生成一首新宋词
import random


def get_rule(cin):
    tunes_rule = {}
    tunes_file = open('Lab1/Output/tunes_rule.txt', encoding='utf-8')
    for line in tunes_file:
        line_list = line[:-1].split(' ')
        tune = line_list[0]
        rule = []
        for n in line_list[1:]:
            rule.append(eval(n))
        tunes_rule[tune] = rule

    if not tunes_rule.__contains__(cin):
        # exit(1)
        return -1
    rule = tunes_rule[cin]
    return rule


file_object = open('Lab1/Output/out.txt', encoding='utf-8')
range_list = []   # 存储所有的词语区间，区间大小即为概率
value_list = []   # 存储该区间的对应词语

range_sum = 0
for line in file_object:
    line = line[:-1]  # 去除尾部的换行符
    if eval(line[0]) <= 1:
        continue
    [weight, value] = line.split(' ')
    weight = eval(weight)
    if len(value) == 1:             # 因词组种类众多，诗句中多为词，降低单字的权重
        weight = weight // 4           # 试图优化词生成
    range_list.append(range_sum)    # 列表中第一个为0
    value_list.append(value)
    range_sum += weight

range_list = range_list[::-1]
value_list = value_list[::-1]

# print(range_list[-5:], value_list[-5:])
# print(range_list.__len__())


def get_word():
    rand_num = random.randint(0, range_sum)
    for n in range(range_list.__len__()):
        if rand_num >= range_list[n]:
            return value_list[n]
# for i in range(10):
#     print(get_word())


def get_poetry(tune):
    poetry = []
    rule = get_rule(tune)
    if rule == -1:
        return rule
    for n in rule:
        line = ''
        while n > 0:
            word = get_word()
            if n >= len(word):
                line += word + ' '
                n = n - len(word)
        poetry.append(line)
    return poetry


if __name__ == '__main__':
    tune = input('请输入词牌名：')
    poetry = get_poetry(tune)
    if poetry == -1:
        print('词牌名不存在！')
    else:
        for line in poetry:
            print(line)

else:
    pass