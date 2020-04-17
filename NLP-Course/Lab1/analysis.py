# coding:utf-8
import re
from typing import TextIO

file_object = open('Lab1/Data/ci_utf8.txt', 'r', encoding='utf-8')
ci_dict = {}
sub_char = r'[ \.\!\/_,$%^*(+\"\']+|[+—~@#￥%&*（）()<>\\“”■□|◎●《》〓〔〕]+'
punctuation = r'[,.;\'!，。、；‘’！…~`?？]'
authorPat = '\n\n\n\n'
poetryPat = '\n\n\n'

try:
    text_content = file_object.read()
finally:
    file_object.close()

text_content = re.sub(sub_char, "", text_content)

ci_dict = {}

author_list = text_content.split(authorPat)  # 以词作者进行分类
tunes_rule = {}  # 记录词牌名的规则

for author_item in author_list:
    value = author_item.split(poetryPat)
    tunes = {}
    for o in value[1:]:
        # print(o)
        [tune, content] = o.split('\n\n')
        if tunes.__contains__(tune):
            tunes[tune].append(content)
        else:
            tunes[tune] = [content]

        if not tunes_rule.__contains__(tune):   # 记录新词牌名的字数规则
            rule = []
            phrases = re.split(punctuation, content)
            for item in phrases:
                rule.append(item.__len__())
            tunes_rule[tune] = rule[:-1] if not rule[-1] else rule

    ci_dict[value[0]] = tunes


resultSum = {}
resultByTune = {}
for author, value in ci_dict.items():
    for tune, content in value.items():
        tmp_dict = {}
        for poetry in content:
            result_list = re.split(punctuation, poetry)
            for phrase in result_list:
                size = len(phrase)
                for index in range(size):
                    tmp_dict[phrase[index]] = tmp_dict.get(phrase[index], 0) + 1
                    if index < len(phrase) - 1:
                        tmp_dict[phrase[index:index + 2]] = tmp_dict.get(phrase[index:index + 2], 0) + 1
        if resultByTune.__contains__(tune):
            tune_dict = resultByTune[tune]
            for k, v in tmp_dict.items():
                tune_dict[k] = tune_dict.get(k, 0) + v
            resultByTune[tune] = tune_dict
        else:
            resultByTune[tune] = tmp_dict

for tune, tune_dict in resultByTune.items():
    for k, v in tune_dict.items():
        resultSum[k] = resultSum.get(k, 0) + v

try:
    fp: TextIO = open("Lab1/Output/out.txt", 'w')
    back_items = [[v[1], v[0]] for v in resultSum.items()]
    back_items.sort()
    for v, k in back_items:
        # print(v, k)
        fp.writelines(str(v) + ' ' + str(k) + '\n')
finally:
    fp.close()


try:
    fp: TextIO = open("Lab1/Output/tunes_rule.txt", 'w')
    for tune, rule in tunes_rule.items():
        line = tune
        for x in rule:
            line = line + ' ' + str(x)
        fp.writelines(line + '\n')

finally:
    fp.close()


print('\nend')

