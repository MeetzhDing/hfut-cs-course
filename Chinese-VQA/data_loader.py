import json
from os.path import isfile, join
import numpy as np
import pickle
import jieba


def prepare_training_data(data_dir='Data/CH_QA'):
    config = json.load(open('config.json'))

    jieba.load_userdict(config['userdict'])
    qa_data_file = join(data_dir, 'qa_data_file.pkl')
    vocab_file = join(data_dir, 'vocab_file.pkl')

    qa_filename = join(data_dir, 'QA_new.json')
    print('Loading CH QA file')
    with open(qa_filename) as f:
        qa_data = json.load(f)

    print("train", len(qa_data['train']))
    print("val", len(qa_data['val']))

    questions, answers = [], []
    for i in range(len(qa_data['train'])):
        questions.append(qa_data['train'][i]['Question'])
        answers.append(qa_data['train'][i]['Answer'])
    for i in range(len(qa_data['val'])):
        questions.append(qa_data['val'][i]['Question'])
        answers.append(qa_data['val'][i]['Answer'])

    answer_vocab = make_answer_vocab(answers)
    question_vocab, max_question_length = make_questions_vocab(questions, answers, answer_vocab)
    print("Max Question Length", max_question_length)

    training_data = []
    for i, qa in enumerate(qa_data['train']):
        ans = qa['Answer']
        if ans in answer_vocab:
            training_data.append({
                'image_id': eval(qa['image_id']),
                'question': np.zeros(max_question_length),
                'answer': answer_vocab[ans]
            })
            question_words = jieba.lcut(qa['Question'])

            base = max_question_length - len(question_words)
            for n in range(0, len(question_words)):
                training_data[-1]['question'][base + n] = question_vocab[question_words[n]]

    print('Training Data', len(training_data))
    val_data = []
    for i, qa in enumerate(qa_data['val']):
        ans = qa['Answer']
        if ans in answer_vocab:
            val_data.append({
                'image_id': eval(qa['image_id']),
                'question': np.zeros(max_question_length),
                'answer': answer_vocab[ans]
            })
            question_words = jieba.lcut(qa['Question'])

            base = max_question_length - len(question_words)
            for n in range(0, len(question_words)):
                val_data[-1]['question'][base + n] = question_vocab[question_words[n]]
    print('Validation Data', len(val_data))

    data = {
        'training': training_data,
        'validation': val_data,
        'answer_vocab': answer_vocab,
        'question_vocab': question_vocab,
        'max_question_length': max_question_length
    }
    print("Saving qa_data")
    with open(qa_data_file, 'wb') as f:
        pickle.dump(data, f)
    with open(vocab_file, 'wb') as f:
        vocab_data = {
            'answer_vocab': data['answer_vocab'],
            'question_vocab': data['question_vocab'],
            'max_question_length': data['max_question_length']
        }
        pickle.dump(vocab_data, f)

    return data


def make_answer_vocab(answers):
    top_n = 1000
    answer_frequency = {}
    for i in answers:
        answer_frequency[i] = answer_frequency.get(i, 0) + 1
    answer_frequency_tuples = [(-frequency, answer) for answer, frequency in answer_frequency.items()]
    answer_frequency_tuples.sort()
    answer_frequency_tuples = answer_frequency_tuples[0:top_n - 1]

    answers_vocab = {}
    for i, ans_freq in enumerate(answer_frequency_tuples):
        ans = ans_freq[1]
        answers_vocab[ans] = i

    answers_vocab['UNK'] = top_n - 1
    return answers_vocab


def make_questions_vocab(questions, answers, answer_vocab):
    question_frequency = {}
    max_question_length = 0
    for i, question in enumerate(questions):
        ans = answers[i]
        count = 0
        if ans in answer_vocab:
            question_words = jieba.lcut(question)
            for qw in question_words:
                question_frequency[qw] = question_frequency.get(qw, 0) + 1
                count = count + 1
        if count > max_question_length:
            max_question_length = count

    qw_freq_threhold = 0
    qw_tuples = [(-frequency, qw) for qw, frequency in question_frequency.items()]
    # qw_tuples.sort()

    qw_vocab = {}
    for i, qw_freq in enumerate(qw_tuples):
        frequency = -qw_freq[0]
        qw = qw_freq[1]
        # print(frequency, qw)
        if frequency > qw_freq_threhold:
            # +1 for accounting the zero padding for batch training
            qw_vocab[qw] = i + 1
        else:
            break

    qw_vocab['UNK'] = len(qw_vocab) + 1
    return qw_vocab, max_question_length


def load_questions_answers(data_dir='Data/CH_QA'):
    qa_data_file = join(data_dir, 'qa_data_file.pkl')

    with open(qa_data_file, 'rb') as f:
        data = pickle.load(f)
        return data


def get_question_answer_vocab(data_dir='Data/CH_QA'):
    vocab_file = join(data_dir, 'vocab_file.pkl')
    vocab_data = pickle.load(open(vocab_file, 'rb'))
    return vocab_data


def load_fc7_features(data_dir, split):
    import h5py
    fc7_features = None
    image_id_list = None
    with h5py.File(join(data_dir, (split + '_fc7.h5')), 'r') as hf:
        fc7_features = np.array(hf.get('fc7_features'))
    with h5py.File(join(data_dir, (split + '_image_id_list.h5')), 'r') as hf:
        image_id_list = np.array(hf.get('image_id_list'))
    return fc7_features, image_id_list


if __name__ == '__main__':
    prepare_training_data()
