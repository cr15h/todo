const Joi = require('joi')

exports.newPostValidation = (data) => {
    const schema = Joi.object({
        taskTitle: Joi.string().required(),
        taskDescription: Joi.string().empty('').default('')
    })
    return schema.validate(data);
};

exports.deleteValidation = (taskid) => {
    return Joi.object({
        deleteId: Joi.number(),
    }).validate(taskid);
}

exports.updateValidation = (taskid,taskTitle,taskDescription) => {
    return Joi.object({
        updateId: Joi.number(),
        taskTitle: Joi.string(),
        taskDescription: Joi.string().empty('').default('')
    }).validate(taskid,taskTitle,taskDescription);
}
