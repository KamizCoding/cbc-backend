import Student from "../models/student.js"

export function listStudents(req,res){
    Student.find().then(
        (studentList)=>{
            res.json({
                list : studentList
            })
        }
    )
}

export function newStudent(req,res){
    const student = new Student(req.body)
    student.save().then(()=>{
        res.json({
            message : "The student was added to the database succesfully"
        })
    }).catch(()=>{
        res.json({
            message : "The student was not ade3d to the database du to an error"
        })
    })
}

export function delStudent(req,res){
    Student.deleteOne({name: req.body.name}).then(()=>{
        res.json({
            message : "The student was deleted from the database succesfully"
        })
})
}