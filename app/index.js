var app = new Vue({
    el: "#app",
    data: {
        listQuestion: [],
        questionIndex: -1,
        userResponses: [],
        isActive: false,
        listAnswer: {
            "Atribut": []
        },
        disease: []
    },

    methods: {
        start: function () {
            this.questionIndex = 0;
        },
        restart: function () {
            this.questionIndex = -1;
            this.userResponses = Array(this.listQuestion.length).fill(null);
            this.listAnswer = {
                "Atribut": Array(this.listQuestion.length).fill(0)
            };
        },
        select: function (index) {
            Vue.set(this.listAnswer.Atribut, this.questionIndex, index);
            Vue.set(this.userResponses, this.questionIndex, index);
            // console.log(this.listAnswer)
            // console.log(this.userResponses)
        },
        next: function () {
            if (this.questionIndex < this.listQuestion.length) this.questionIndex++;
            if (this.questionIndex >= this.listQuestion.length) this.predict();
        },
        prev: function () {
            if (this.listQuestion.length > 0) this.questionIndex--;
        },
        predict: async function () {
            var answers = {};
            for (var i = 0; i < this.listAnswer.Atribut.length; i++) {
                answers[i.toString()] = this.listAnswer.Atribut[i];
            }
            this.listAnswer.Atribut = answers;
            try {
                const response = await axios.post("http://127.0.0.1:5000/predict", this.listAnswer);
                this.disease = response.data[0];
                // console.log(response.data)
            } catch (e) {
                console.log(e)
            }
        }
    },
    async mounted() {
        try {
            const response = await axios.get("http://127.0.0.1:5000/questions");
            this.listQuestion = response.data;
            this.userResponses = Array(this.listQuestion.length).fill(null);
            this.listAnswer = {
                "Atribut": Array(this.listQuestion.length).fill(0)
            };
            // console.log(this.listQuestion)
        } catch (e) {
            console.log(e)
        }
    }
});