import re

punctuation = r'[,.;!，。、:：；！?？]'

frequency = {}
gram_2 = {}
gram_3 = {}

with open('Lab2/Output/gram2.txt', 'r', encoding='utf-8') as fp:
    lines = fp.readlines()
    for line in lines:
        info = line.split(' : ')
        gram_2[info[0]] = eval(info[1]) + 1

# with open('Output/gram3.txt', 'r', encoding='utf-8') as fp:
#     lines = fp.readlines()
#     for line in lines:
#         info = line.split(' : ')
#         gram_3[info[0]] = eval(info[1]) + 1

with open('Lab2/Output/frequency.txt', 'r', encoding='utf-8') as fp:
    lines = fp.readlines()
    for line in lines:
        info = line.split(' : ')
        frequency[info[0]] = eval(info[1])


# 前向最大匹配
def front_max_match(paragraph):
    sentences = re.split(punctuation, paragraph)
    ret = []
    for sentence in sentences:
        max_len = 10 if len(sentence) > 10 else len(sentence)

        sen = sentence
        result = ''
        while len(sen):
            tmp_len = len(sen)
            while tmp_len > 1:
                if sen[:tmp_len] in frequency:
                    result = result + sen[:tmp_len] + ' '
                    sen = sen[tmp_len:]
                    break
                else:
                    tmp_len = tmp_len - 1
            if tmp_len == 1:
                result = result + sen[:1] + ' '
                sen = sen[1:]
        ret.append(result)
    return ret


# 后向最大匹配
def back_max_match(paragraph):
    sentences = re.split(punctuation, paragraph)
    ret = []
    for sentence in sentences:
        max_len = 10 if len(sentence) > 10 else len(sentence)

        sen = sentence
        result = ''
        while len(sen):
            tmp_len = len(sen)
            while tmp_len > 1:
                if sen[-tmp_len:] in frequency:
                    result = sen[-tmp_len:] + ' ' + result
                    sen = sen[:-tmp_len]
                    break
                else:
                    tmp_len = tmp_len - 1
            if tmp_len == 1:
                result = sen[-1:] + ' ' + result
                sen = sen[:-1]
        ret.append(result)
    return ret


# 后后向结合最大匹配
def max_match(paragraph):
    sentences = re.split(punctuation, paragraph)
    ret = []
    for sentence in sentences:
        max_len = len(sentence)

        sen = sentence
        front_result = ''
        back_result = ''
        while len(sen):
            tmp_len = len(sen)
            while tmp_len > 1:
                a, b = frequency.get(sen[:tmp_len], 0), frequency.get(sen[-tmp_len:], 0)  # a为前向找到词权重，b后向找到词权重
                if a == 0 and b == 0:
                    tmp_len = tmp_len - 1
                    continue
                elif a >= b:
                    front_result = front_result + sen[:tmp_len] + ' '
                    sen = sen[tmp_len:]
                    break
                elif a < b:
                    back_result = sen[-tmp_len:] + ' ' + back_result
                    sen = sen[:-tmp_len]
                    break
            if tmp_len == 1:
                front_result = front_result + sen[:1] + ' '
                sen = sen[1:]
        ret.append(front_result + ' ' + back_result)
    return ret


all_split = []


def front_sub_str(sen, before=''):
    tmp_len = len(sen)

    if len(sen) == 0:
        all_split.append(before)
        return

    find_flag = False
    while tmp_len > 0:
        if sen[:tmp_len] in frequency:
            find_flag = True
            front_sub_str(sen[tmp_len:], before=before + sen[:tmp_len] + ' ')
        tmp_len = tmp_len - 1
    if not find_flag:
        front_sub_str(sen[1:], before=before + sen[0] + ' ')


def ngram(paragraph):
    sentences = re.split(punctuation, paragraph)
    ret = []
    for sentence in sentences:
        all_split.clear()
        front_sub_str(sentence)
        # print(all_split)
        best_case = ''
        best_num = 1
        for case in all_split:
            div = case.split(' ')
            first = '<BOS>'
            # second = '<BOS>'
            word = '<BOS>'
            tmp_num = 1
            for item in div:
                first = word
                # second = word
                word = item
                if word == '':
                    word = '<EOS>'
                combine = first + '&' + word
                n = gram_2.get(combine, 1)
                tmp_num = tmp_num * n
                print(word, n, sep='', end=' ')
            print()
            if tmp_num > best_num:
                best_case = case
                best_num = tmp_num
        ret.append(best_case)
    return ret


if __name__ == '__main__':
    while True:
        paragraph = input('请输入句子：')

        for line in ngram(paragraph):
            print(line)

        for line in max_match(paragraph):
            print(line)
