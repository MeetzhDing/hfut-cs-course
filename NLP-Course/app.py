from flask import Flask, request, render_template
import Lab1.produce as mypoetry
import Lab2.spilt as mysplit

app = Flask(__name__)


@app.route('/')
def hello():
    return 'Hello !'


@app.route('/lab1', methods=['GET'])
def lab1():
    return render_template('lab1.html')


@app.route('/lab1/result', methods=['GET', 'POST'])
def poetry():
    print(request.form)
    tune = request.form.get('tune', None)
    if tune is None:
        return '输入错误'
    poetry = mypoetry.get_poetry(tune)
    return render_template('poetry.html', tune=tune, poetry=poetry)


@app.route('/lab2', methods=['GET'])
def lab2():
    return render_template('lab2.html')


@app.route('/lab2/result', methods=['GET', 'POST'])
def distinguish():
    print(request.form)
    paragraph = request.form.get('paragraph', None)
    if paragraph is None:
        return '输入错误'
    match_result = mysplit.max_match(paragraph)
    ngram_result = mysplit.ngram(paragraph)

    return render_template('mysplit.html', match_result=match_result, ngram_result=ngram_result)


app.config['DEBUG'] = True

if __name__ == '__main__':
    # app.debug = True
    app.run()
