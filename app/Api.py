import os
import pickle
import pandas
import json
from flask import Flask, jsonify
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
api = Api(app)
parser = reqparse.RequestParser()

parser.add_argument('Atribut', type=dict)

file_model = os.path.abspath(
    os.path.join(__file__, '../../model/model.pkl'))
if os.path.isfile(file_model):
    model = pickle.load(open(file_model, "rb"))
else:
    raise FileNotFoundError

file_desease = os.path.abspath(
    os.path.join(__file__, '../../data/disease.csv'))
if os.path.isfile(file_desease):
    labels = pandas.read_csv(file_desease)
else:
    raise FileNotFoundError

file_indication = os.path.abspath(
    os.path.join(__file__, '../../data/indication.csv'))
if os.path.isfile(file_indication):
    indications = pandas.read_csv(file_indication)
else:
    raise FileNotFoundError


class Questions(Resource):
    def get(self):
        res_json = json.dumps(indications.to_dict('records'))
        res_json = json.loads(res_json)
        return res_json


class Predict(Resource):
    def post(self):
        args = parser.parse_args()
        x = [list(args['Atribut'].values())]
        y = model.predict(x)
        predicted_labels = y.tolist()
        diseases = [labels.loc[labels['DiseaseId'] == label]
                    for label in predicted_labels]
        disease = diseases[0]
        index = disease.index[0]
        return [{
            'DiseaseName': disease['DiseaseName'][index],
            'DiseaseCause': disease['DiseaseCause'][index],
            'DiseaseSolution': disease['DiseaseSolution'][index],
            'DiseaseImage': disease['DiseaseImage'][index]
        }]


api.add_resource(Questions, "/questions")
api.add_resource(Predict, "/predict")

if __name__ == "__main__":
    app.run(debug=True)
