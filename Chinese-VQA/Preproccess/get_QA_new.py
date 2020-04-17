import json
import os.path
import jieba

punctuation = r'，。、；’‘【】-=+·,.;[]\/《》'

data_dir = 'Data/CH_QA'
filename = 'FM-CH-QA.json'
absdir = os.path.dirname(os.path.abspath(__file__))
jieba.load_userdict(os.path.join(absdir, 'userdict.txt'))
with open(os.path.join(data_dir, filename), 'r', encoding='utf-8') as f:
    fm_qa = json.load(f)

for kind in ['train', 'val']:
    raw_data = fm_qa[kind]
    print('%s集提取前共有%d个问题' % (kind, len(raw_data)))
    new_data = []
    for index, item in enumerate(raw_data):
        question = item['Question'][:-1]
        answer = item['Answer'][:-1]
        if question[-1] in punctuation:
            question = question[:-1]
        if answer[-1] in punctuation:
            answer = answer[:-1]

        if '、' in answer or '，' in answer:  # 多答案结果直接剔除
            continue
        q_len = len(jieba.lcut(question))  # 分词后序列长度大于指定值的问题直接剔除
        if q_len > 10:
            continue

        words = jieba.lcut(answer)  # 分词结果
        if len(words) == 1:
            item['Question'] = question
            item['Answer'] = answer
            new_data.append(item)
        else:
            ans = ''
            for word in words:
                if word not in question:
                    ans = ans + word
            if ans in answer:
                item['Question'] = question
                item['Answer'] = ans
                new_data.append(item)

    print("%s集提取后剩下%d个问题" % (kind, len(new_data)))
    fm_qa[kind] = new_data

with open(os.path.join(data_dir, 'QA_new.json'), 'w', encoding='utf-8') as f:
    json.dump(fm_qa, f, indent=1)
