import json
import os.path

punctuation = r'，。、；’‘【】-=+·,.;[]\/《》'

data_dir = 'Data/EN_QA'
filename = 'MultipleChoice_mscoco_train2014_questions.json'

absdir = os.path.dirname(os.path.abspath(__file__))


with open(os.path.join(data_dir, filename), 'r', encoding='utf-8') as f:
    fm_qa = json.load(f)

with open(os.path.join(data_dir, '%s_new.json' % filename), 'w', encoding='utf-8') as f:
    json.dump(fm_qa, f, indent=1)
