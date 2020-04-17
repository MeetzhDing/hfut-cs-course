from sklearn.datasets import load_files
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import KFold
from sklearn.svm import SVC

categories = ['alt.atheism',
              'rec.sport.hockey',
              'comp.graphics',
              'sci.crypt',
              'comp.os.ms-windows.misc',
              'sci.electronics',
              'comp.sys.ibm.pc.hardware',
              'sci.med',
              'comp.sys.mac.hardware',
              'sci.space',
              'comp.windows.x',
              'soc.religion.christian',
              'misc.forsale',
              'talk.politics.guns',
              'rec.autos' 
              'talk.politics.mideast',
              'rec.motorcycles',
              'talk.politics.misc',
              'rec.sport.baseball',
              'talk.religion.misc']

train_path = 'data/20news-bydate-train'
train_set = load_files(container_path=train_path, categories=categories)
test_path = 'data/20news-bydate-test'
test_set = load_files(container_path=test_path, categories=categories)

count_vect = CountVectorizer(stop_words='english', decode_error='ignore')
tf_counts = count_vect.fit_transform(train_set.data)
tfidf_vect = TfidfVectorizer(stop_words='english', decode_error='ignore')
tfidf_counts = tfidf_vect.fit_transform(train_set.data)

models = {'LR': LogisticRegression(), 'KNN': KNeighborsClassifier(), 'MNB': MultinomialNB()}
# models['SVM'] = SVC()
print('TF:')
for key in models:
    cv_results = cross_val_score(models[key], tf_counts, train_set.target, cv=KFold(n_splits=10))
    print('%s : %f (%f)' % (key, cv_results.mean(), cv_results.std()))

print()
print('TF-IDF:')
for key in models:
    cv_results = cross_val_score(models[key], tfidf_counts, train_set.target, cv=KFold(n_splits=10))
    print('%s : %f (%f)' % (key, cv_results.mean(), cv_results.std()))


