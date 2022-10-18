import AsyncStorage from "@react-native-async-storage/async-storage"

const defaultSchema = () => ({
    id: "DEFAULT_GENERIC",
    matchForm: [
        {
            type: "header",
            title: "General"
        },
        {
            type: "number",
            title: "Team"
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
            type: "header",
            title: "Overview"
        },
        {
            type: "text",
            title: "Comments"
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
})

const defaultData = () => ({
    schema: defaultSchema(),
    scoutForms: []
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
    addScoutForm(form, callback){
        if(this.data.scoutForms.some((storedForm) => storedForm.id == form.id)){
            this.data.scoutForms[this.data.scoutForms.findIndex((storedForm) => storedForm.id == form.id)] = form
        } else {
            this.data.scoutForms.push(form)
        }
        write(this.data, callback)
    }
    clearForms(callback){
        this.data.scoutForms = []
        write(this.data, callback)
    }
    setSchema(schema, callback){
        this.data.schema = schema
        write(this.data, callback)
    }
    deleteSchema(callback){
        this.setSchema(defaultSchema(), callback)
    }
}

export default Storage