import re
from typing import TextIO

punctuation = r'[,.;!，。、:：；！?？]'
# sub_char =

file_object = open('Data/1998-01-2003.txt', 'r', encoding='utf-8')

text = file_object.readlines()
len_count = {}
gram_2 = {}
gram_3 = {}
frequency = {}

for line in text:
    if line == '\n':
        continue
    # sentence = re.split(punctuation, line)
    phrases = line.split('  ')
    first = '<BOS>'
    second = '<BOS>'
    word = '<BOS>'
    for item in phrases[1:-1]:
        first = second
        second = word

        word_info = item.split('/')
        if word_info[1] == 'm':
            word = '/m'
        # elif word_info[1] == 't':
        #     word = '/t'
        # elif word_info[1] == 'ns':
        #     word = '/ns'
        else:
            word = word_info[0]

        if word.__contains__('{'):
            word = item.split('{')[0]
        if word.__contains__('Pp'):
            word = re.sub("[A-Za-z0-9\!\%\[\]\,\。]", "", word)
        if word.__contains__('['):
            word = word.replace('[', '')

        frequency[word] = frequency.get(word, 0) + 1
        if len(word) >= 5:
            len_count[len(word)] = len_count.get(len(word), 0) + 1
        if word in punctuation:
            word = '<EOS>'

        tmp1 = second + '&' + word
        gram_2[tmp1] = gram_2.get(tmp1, 0) + 1
        tmp2 = first + '&' + tmp1
        gram_3[tmp2] = gram_3.get(tmp2, 0) + 1

        if word == '<EOS>':
            first = '<BOS>'
            second = '<BOS>'
            word = '<BOS>'
            continue


print(len_count)

try:
    fp: TextIO = open("Output/gram2.txt", 'w')
    for key, val in gram_2.items():
        line = key + ' : ' + str(val)
        fp.writelines(line + '\n')
finally:
    fp.close()

try:
    fp: TextIO = open("Output/gram3.txt", 'w')
    for key, val in gram_3.items():
        line = key + ' : ' + str(val)
        fp.writelines(line + '\n')
finally:
    fp.close()

try:
    fp: TextIO = open("Output/frequency.txt", 'w')
    for key, val in frequency.items():
        line = key + ' : ' + str(val)
        fp.writelines(line + '\n')
finally:
    fp.close()

print()



