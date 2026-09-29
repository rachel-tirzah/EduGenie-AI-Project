const task =
    document.getElementById("task");

const input =
    document.getElementById("input");

const submit =
    document.getElementById("submit");

const status =
    document.getElementById("status");

const result =
    document.getElementById("result");

const resultContent =
    document.getElementById("result-content");

const copy =
    document.getElementById("copy");


/* -------------------------
   PLACEHOLDERS
------------------------- */

const placeholders = {

    qa:
        "Example: What is artificial intelligence?",

    explain:
        "Example: Explain machine learning to a beginner.",

    quiz:
        "Example: Photosynthesis",

    summarize:
        "Paste the educational text you want to summarize.",

    learn:
        "Example: I want to learn Python from beginner to advanced."

};


/* Change placeholder */

task.addEventListener(
    "change",
    () => {

        input.placeholder =
            placeholders[
                task.value
            ];

    }
);


/* -------------------------
   SECURITY
------------------------- */

function escapeHtml(value) {

    return String(value).replace(
        /[&<>"']/g,

        character => ({

            "&": "&amp;",

            "<": "&lt;",

            ">": "&gt;",

            '"': "&quot;",

            "'": "&#039;"

        }[character])
    );

}


/* -------------------------
   RENDER RESULT
------------------------- */

function render(data) {

    /*
       Quiz results are returned
       as an array.
    */

    if (Array.isArray(data)) {

        resultContent.innerHTML =
            data.map(
                (question, index) => `

                <article class="quiz-item">

                    <h3>
                        ${index + 1}.
                        ${escapeHtml(
                            question.question
                        )}
                    </h3>


                    ${
                        question.options
                            .map(
                                option => `
                                <div class="quiz-option">
                                    ${escapeHtml(option)}
                                </div>
                                `
                            )
                            .join("")
                    }


                    <div class="quiz-answer">

                        Correct answer:
                        ${escapeHtml(
                            question.answer
                        )}

                    </div>


                    <div>

                        ${escapeHtml(
                            question.explanation || ""
                        )}

                    </div>

                </article>

                `
            )
            .join("");

        return;

    }


    /*
       Text results
    */

    resultContent.textContent =
        data;

}


/* -------------------------
   GENERATE
------------------------- */

submit.addEventListener(
    "click",
    async () => {

        const text =
            input.value.trim();


        if (!text) {

            status.textContent =
                "Please enter a question, topic, or passage.";

            return;

        }


        const endpoints = {

            qa:
                "/qa",

            explain:
                "/explain",

            quiz:
                "/quiz",

            summarize:
                "/summarize",

            learn:
                "/learn/recommendations"

        };


        const endpoint =
            endpoints[
                task.value
            ];


        submit.disabled = true;

        status.textContent =
            "EduGenie is thinking...";

        result.classList.add(
            "hidden"
        );


        try {

            const response =
                await fetch(
                    endpoint,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(

                                task.value === "qa"

                                    ? {
                                        question: text
                                    }

                                    : {
                                        text: text
                                    }

                            )

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Request failed."
                );

            }


            render(
                data.result
            );


            result.classList.remove(
                "hidden"
            );


            status.textContent =
                "Done!";


        }

        catch (error) {

            resultContent.textContent =
                error.message;

            result.classList.remove(
                "hidden"
            );

            status.textContent =
                "Something went wrong.";

        }

        finally {

            submit.disabled =
                false;

        }

    }
);


/* -------------------------
   COPY RESULT
------------------------- */

copy.addEventListener(
    "click",
    async () => {

        await navigator.clipboard.writeText(
            resultContent.innerText
        );


        copy.textContent =
            "Copied!";


        setTimeout(
            () => {

                copy.textContent =
                    "Copy";

            },
            1200
        );

    }
);