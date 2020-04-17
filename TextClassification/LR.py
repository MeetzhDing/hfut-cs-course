from sklearn.datasets import load_files
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.metrics import accuracy_score
from sklearn.model_selection import KFold
from sklearn.model_selection import GridSearchCV

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

tfidf_vect = TfidfVectorizer(stop_words='english', decode_error='ignore')
tfidf_counts = tfidf_vect.fit_transform(train_set.data)

param_grid = {'C': [0.1, 1, 10, 100]}
model = LogisticRegression()
grid = GridSearchCV(estimator=model, param_grid=param_grid, cv=KFold(n_splits=5))
grid_result = grid.fit(X=tfidf_counts, y=train_set.target)
print('当 %s 时最优 : %s ' % (grid_result.best_params_, grid_result.best_score_))

model = LogisticRegression(C=grid_result.best_params_['C'])
model.fit(tfidf_counts,train_set.target)
test_counts = tfidf_vect.transform(test_set.data)
predictions = model.predict(test_counts)
print(accuracy_score(test_set.target, predictions))
print(classification_report(test_set.target, predictions))


# one = b'From: nelson_p@apollo.hp.com (Peter Nelson)\nSubject: Re: Waco\nDistribution: usa\nNntp-Posting-Host: c.ch.apollo.hp.com\nOrganization: Hewlett-Packard Corporation, Chelmsford, MA\nLines: 64\n\nIn article <C5u66A.BFH@cbnews.cb.att.com> ddn@cbnews.cb.att.com (david.d.nason) writes:\n\n>Thirdly, it seems incredibly hypocritical to place blame given\n>the benefit of hindsight - something that those who made the\n>decisions did not have the benefit of. Why not give them the courtesy\n>of acknowledging that they did the best they could with the\n>data they had - in a very, very difficult situation.\n\n What is your proof that they "did the best they could"? Unless\n they had strong evidence that the children were in IMMEDIATE danger\n then "the best they could" have done was to SHOW RESTRAINT.\n\n Some of us DID predict this outcome, or at least suggested a\n strong possibility of it. I, for one, said that in the event of\n an assault against the building the CHILDREN wer...'
# two = b'From: boyd@acsu.buffalo.edu (Daniel F Boyd)\nSubject: Re: Off the shelf cheap DES keyseach machine (Was: Re: Corporate acceptance of the wiretap chip)\nOrganization: UB\nLines: 40\nNntp-Posting-Host: autarch.acsu.buffalo.edu\n\nIn article <strnlghtC5wCMo.Fx5@netcom.com> strnlght@netcom.com (David Sternlight) writes:\n> In article <C5uvn4.MF7@austin.ibm.com> arussell@austin.ibm.com (AG Russell)\n> writes:\n> >At the company I worked for previously, I received a file that was\n> >des encryped and the person that had sent it, went on vaction.\n> >Rather than wait two weeks I set up a straight frontal attack with\n> >one key at a time.  It only took two(2) days to crack the file.\n\n> Taking this at face value (though it seems quite dissonant with much else\n> that has been published here about brute force DES cracking, unless Russell\n> was lucky with respect to the key), I\'d be very interested in whether the\n> program Russell used is available? In whether he used a cleartext\n...'
# user_input = [one, two]
# user_vec = tfidf_vect.transform(user_input)
# user_out = model.predict(user_vec)
# for x in user_out:
#     print(categories[x])