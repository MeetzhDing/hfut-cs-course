import tensorflow as tf
from scipy import misc
from os import listdir
from os.path import isfile, join
import json
import utils
import argparse
import numpy as np
import pickle
import h5py
import time
import data_loader


def main():
    config = json.load(open('config.json'))

    parser = argparse.ArgumentParser()
    parser.add_argument('--split', type=str, default=config['split'],
                        help='train/val')
    parser.add_argument('--model_path', type=str, default=config['model_path'],
                        help='Pretrained VGG16 Model')
    parser.add_argument('--qa_dir', type=str, default=config['qa_dir'],
                        help='QA Data directory')
    parser.add_argument('--data_dir', type=str, default=config['data_dir'],
                        help='Common Data directory')
    parser.add_argument('--batch_size', type=int, default=10,
                        help='Batch Size')

    args = parser.parse_args()

    vgg_file = open(args.model_path, 'rb')
    vgg16raw = vgg_file.read()
    vgg_file.close()

    graph_def = tf.GraphDef()
    graph_def.ParseFromString(vgg16raw)

    images = tf.placeholder("float", [None, 224, 224, 3])
    tf.import_graph_def(graph_def, input_map={"images": images})

    graph = tf.get_default_graph()

    for opn in graph.get_operations():
        print("Name", opn.name, list(opn.values()))

    all_data = data_loader.load_questions_answers(args.qa_dir)
    if args.split == "train":
        qa_data = all_data['training']
    else:
        qa_data = all_data['validation']

    image_ids = {}
    for qa in qa_data:
        image_ids[qa['image_id']] = 1

    image_id_list = [img_id for img_id in image_ids]
    print("Total Images", len(image_id_list))

    sess = tf.Session()
    fc7 = np.ndarray((len(image_id_list), 4096))
    idx = 0

    err_file = open('err.txt', 'w', encoding='utf-8')

    while idx < len(image_id_list):
        start = time.clock()
        image_batch = np.ndarray((args.batch_size, 224, 224, 3))

        count = 0
        for i in range(0, args.batch_size):
            if idx >= len(image_id_list):
                break
            # print(image_id_list[idx])
            filename = 'COCO_%s2014_%.12d.jpg' % (args.split, image_id_list[idx])
            image_file = join(args.data_dir, '%s2014' % args.split, filename)
            try:
                image_batch[i, :, :, :] = utils.load_image_array(image_file)
            except (ValueError, FileNotFoundError, OSError) as e:
                print("http://images.cocodataset.org/%s2014/%s" % (args.split, filename))
                err_file.write(str(image_id_list[idx]) + '\n')
            idx += 1
            count += 1
        err_file.flush()
        feed_dict = {images: image_batch[0:count, :, :, :]}
        fc7_tensor = graph.get_tensor_by_name("import/Relu_1:0")
        fc7_batch = sess.run(fc7_tensor, feed_dict=feed_dict)
        fc7[(idx - count):idx, :] = fc7_batch[0:count, :]
        end = time.clock()
        print("Time for batch 10 photos", end - start)
        print("Hours For Whole Dataset", (len(image_id_list) * 1.0) * (end - start) / 60.0 / 60.0 / 10.0)

        print("Images Processed", idx)

    print("Saving fc7 features")
    h5f_fc7 = h5py.File(join(args.data_dir, args.split + '_fc7.h5'), 'w')
    h5f_fc7.create_dataset('fc7_features', data=fc7)
    h5f_fc7.close()

    print("Saving image id list")
    h5f_image_id_list = h5py.File(join(args.data_dir, args.split + '_image_id_list.h5'), 'w')
    h5f_image_id_list.create_dataset('image_id_list', data=image_id_list)
    h5f_image_id_list.close()
    print("Done!")


if __name__ == '__main__':
    main()
