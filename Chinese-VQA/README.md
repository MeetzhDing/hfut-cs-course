# Chinese-VQA

this repo is modified from https://github.com/crownpku/Chinese-VQA

1. run get_QA_new.py for chinese word segmentation
2. run data_loader.py to get qa_data_file.pkl and vocab_file.pkl
3. run extract_fc7.py to get fc7 features


## Downloads
Coco Pictures 2014: http://cocodataset.org/#download

VGG16 Model: https://www.cs.toronto.edu/~frossard/post/vgg16/

Chinese VQA Text Data: http://research.baidu.com/Public/uploads/5ac9e10bdd572.gz


## The result of this repo
|epoch|evaluate ACC|
|:-----:|:-----:|
|2   |52.2%|
|4   |53.4%|
|6   |53.5%|
|8   |53.6%|
|20  |53.9%|
|30  |51.5%|
|60  |51.2%|
|90  |50.9%|
|120 |50.1%|
|200 |50.4%|


