import AsyncStorage from "@react-native-async-storage/async-storage"

const defaultData = () => ({
    schema: {
        id: "DEFAULT_GENERIC",
        matchForm: [
            {
                type: "header",
                title: "General"
            },
            {
                type: "number",
                title: "Team Number"
            },
            {
                type: "text",
                title: "General Comments"
            },
            {
                type: "header",
                title: "Autonomous"
            },
            {
                type: "number",
                title: "Autonomous Points"
            },
            {
                type: "text",
                title: "Autonomous Comments"
            },
            {
                type: "header",
                title: "Teleop"
            },
            {
                type: "number",
                title: "Teleop Points"
            },
            {
                type: "slider",
                title: "Quality of Defense",
                min: 0,
                max: 10,
                step: 1
            },
            {
                type: "slider",
                title: "Quality under Defense",
                min: 0,
                max: 10,
                step: 1
            },
            {
                type: "slider",
                title: "Strength",
                min: 0,
                max: 10,
                step: 1
            },
            {
                type: "slider",
                title: "Speed",
                min: 0,
                max: 10,
                step: 1
            },
            {
                type: "number",
                title: "Fouls"
            },
            {
                type: "number",
                title: "Tech Fouls"
            },
            {
                type: "text",
                title: "Teleop Comments"
            }
        ],
        pitForm: [
            {
                type: "header",
                title: "General"
            },
            {
                type: "number",
                title: "Team Number"
            },
            {
                type: "toggle",
                title: "Swerve?"
            },
            {
                type: "text",
                title: "General Comments"
            },
            {
                type: "header",
                title: "Autonomous"
            },
            {
                type: "number",
                title: "Expected Autonomous Points"
            },
            {
                type: "text",
                title: "Autonomous Comments"
            },
            {
                type: "header",
                title: "Teleop"
            },
            {
                type: "number",
                title: "Expected Teleop Points"
            },
            {
                type: "text",
                title: "Teleop Comments"
            }
        ]
    },
    scoutForms: []
})

// for ui dev and debug
const exampleData = () => ({
    schema: {
        id: "FRC_321 MainSeason_2022_v1",
        matchForm: [
            {
                type: "header",
                title: "General"
            },
            {
                type: "number",
                title: "Team Number"
            },
            {
                type: "slider",
                title: "Communication",
                min: 0,
                max: 10,
                step: 1
            },
            {
                type: "slider",
                title: "Strategy",
                min: 0,
                max: 10,
                step: 1
            },
            {
                type: "text",
                title: "Additional General Comments"
            },
            // Auto
            {
                type: "header",
                title: "Auto"
            },
            {
                type: "toggle",
                title: "Left Tarmac?"
            },
            {
                type: "toggle",
                title: "Shoots Lower Goal?"
            },
            {
                type: "toggle",
                title: "Shoots Upper Goal?"
            },
            {
                type: "slider",
                title: "Lower Goals Scored",
                min: 0,
                max: 5,
                step: 1
            },
            {
                type: "slider",
                title: "Upper Goals Scored",
                min: 0,
                max: 5,
                step: 1
            },
            {
                type: "text",
                title: "Additional Comments on Auto"
            },
            // Teleop
            {
                type: "header",
                title: "Teleop"
            },
            {
                type: "toggle",
                title: "Shoots Lower Goal?"
            },
            {
                type: "toggle",
                title: "Shoots Upper Goal?"
            },
            {
                type: "toggle",
                title: "Shoots From Any Distance?"
            },
            {
                type: "number",
                title: "Shots Scored in Lower Goal"
            },
            {
                type: "number",
                title: "Shots Scored in Upper Goal"
            },
            {
                type: "slider",
                title: "Quality of Defense",
                min: 0,
                max: 10,
                step: 1
            },
            {
                type: "slider",
                title: "Quality Under Defense",
                min: 0,
                max: 10,
                step: 1
            },
            {
                type: "slider",
                title: "Fouls",
                min: 0,
                max: 10,
                step: 1
            },
            {
                type: "slider",
                title: "Tech Fouls",
                min: 0,
                max: 10,
                step: 1
            },
            {
                type: "text",
                title: "Additional Comments on Teleop"
            },
            {
                type: "header",
                title: "End Game"
            },
            {
                type: "radio",
                title: "Climb Rung Reached",
                options: [
                    "None",
                    "Lower",
                    "Mid",
                    "High"
                ]
            },
            {
                type: "slider",
                title: "Climb Speed in Seconds",
                min: 0,
                max: 30,
                step: 5
            },
            {
                type: "text",
                title: "Additional Comments on End Game"
            }
        ],
        pitForm: [
            {
                type: "header",
                title: "General"
            },
            {
                type: "number",
                title: "Team Number"
            },
            {
                type: "toggle",
                title: "Swerve?"
            },
            {
                type: "text",
                title: "General Comments"
            },
            {
                type: "header",
                title: "Autonomous"
            },
            {
                type: "number",
                title: "Expected Autonomous Points"
            },
            {
                type: "text",
                title: "Autonomous Comments"
            },
            {
                type: "header",
                title: "Teleop"
            },
            {
                type: "number",
                title: "Expected Teleop Points"
            },
            {
                type: "text",
                title: "Teleop Comments"
            }
        ]
    },
    scoutForms: [
        {
            id: "9/16/2022",
            type: "Match",
            inputs: { "Team Number": 321 }
        },
        {
            id: "9/17/2022",
            type: "Match",
            inputs: { "Team Number": 1640 }
        },
        {
            id: "9/18/2022",
            type: "Pit",
            inputs: { "Team Number": 316 }
        },
        {
            id: "9/19/2022",
            type: "Match",
            inputs: { "Team Number": 1040 }
        },
        {
            id: "9/16/2022",
            type: "Match",
            inputs: { "Team Number": 321 }
        },
        {
            id: "9/17/2022",
            type: "Match",
            inputs: { "Team Number": 1640 }
        },
        {
            id: "9/18/2022",
            type: "Pit",
            inputs: { "Team Number": 316 }
        },
        {
            id: "9/19/2022",
            type: "Match",
            inputs: { "Team Number": 1040 }
        },
        {
            id: "9/16/2022",
            type: "Match",
            inputs: { "Team Number": 321 }
        },
        {
            id: "9/17/2022",
            type: "Match",
            inputs: { "Team Number": 1640 }
        },
        {
            id: "9/18/2022",
            type: "Pit",
            inputs: { "Team Number": 316 }
        },
        {
            id: "9/19/2022",
            type: "Match",
            inputs: { "Team Number": 1040 }
        }
    ]
})

const write = (data, callback) => {
    AsyncStorage.setItem("scouting-app", JSON.stringify(data), callback)
}

class Storage {
    constructor(){
        this.data = defaultData()
    }
    init(callback){
        AsyncStorage.getItem("scouting-app", (error, res) => {
            if(error){
                callback()
            } else if(res != null) {
                this.data = JSON.parse(res)
                callback()
            } else {
                this.data = defaultData()
                write(this.data, callback)
            }
        })
    }
    getSchema(){
        return this.data.schema
    }
    getSchemaId(){
        return this.data.schema.id
    }
    getMatchForm(){
        return this.data.schema.matchForm
    }
    getPitForm(){
        return this.data.schema.pitForm
    }
    getScoutForms(){
        return this.data.scoutForms
    }
    setSchema(schema, callback){
        this.data.schema = schema
        write(this.data, callback)
    }
    addScoutForm(form, callback){
        if(this.data.scoutForms.some((storedForm) => storedForm.id == form.id)){
            this.data.scoutForms[this.data.scoutForms.findIndex((storedForm) => storedForm.id == form.id)] = form
        } else {
            this.data.scoutForms.push(form)
        }
        write(this.data, callback)
    }
}

export default Storage