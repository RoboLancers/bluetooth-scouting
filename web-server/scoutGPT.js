import * as dotenv from 'dotenv'
dotenv.config()


import { lookup } from "dns"


import { prisma } from "./db.js";

import { Configuration, OpenAIApi } from "openai"

const apiKey = process.env.OPENAI_API_KEY






export const scoutGPT = async (prompt) => {

    if (!apiKey) {
        return "No API key provided. ScoutGPT is not available at this time. Please try again later"
    }

    const configuration = new Configuration({
        apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);


    const data = (await prisma.form.findMany({
        take: 10
    }))
    const stringifedData = data.map((form) => `${form.id}, ${form.inputs}, ${form.type}`).toString()





    lookup("nodejs.org", (err) => {
        if (err && err.code == "ENOTFOUND") {
            return "No internet connection. ScoutGPT is only available for after match analysis"
        }
    })


    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: "You are ScoutGPT. You are an AI assistant for the Robolancers. Your role is to analyze scouting data for FRC and answer questions. Be concise and always explain your reasoning with evidence from the data provided. Answer unrelated questions with I don't know"
            },
            {
                role: "user",
                content: `Data: [${stringifedData}] ${prompt}`
            }
            ],
            temperature: 0,
        }, {
            responseType: "json"
        });


        return completion.data.choices[0].message.content

    } catch (e) {
        console.log(e)
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
        return "ScoutGPT is not available at this time. Please try again later"
    }





}
